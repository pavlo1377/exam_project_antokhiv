import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import authPool from "./authDatabase.js"; // Імпортуємо підключення до бази даних авторизації
import schedulePool from "./scheduleDatabase.js"; // Імпортуємо підключення до бази даних розкладу
import { GET_SCHEDULE_QUERY_THIRD_YEAR } from "./queries.js"; // Імпортуємо SQL запит
import { GET_SCHEDULE_QUERY_SECOND_YEAR } from "./queries.js"; // Імпортуємо SQL запит
import { GET_SCHEDULE_QUERY_FIRST_YEAR } from "./queries.js"; // Імпортуємо SQL запит

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// API для авторизації

// app.get("/", (req, res) => {
//   if (req.session.username) {
//     return res.json({ valid: true, username: req.session.username });
//   } else {
//     return res.json({ valid: false });
//   }
// });

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Генеруємо соль для хешування
    const salt = await bcrypt.genSalt(10);
    // Хешуємо пароль
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await authPool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword] // Зберігаємо хешований пароль
    );
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Error occurred:", err);
    return res.status(500).json({ message: "Error in Node" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authPool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Перевіряємо хешований пароль
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        req.session.username = user.email;
        console.log(user);
        return res.json({ message: "Login successful", user });
      } else {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    return res.status(500).json({ message: "Error in Node login" });
  }
});

// API для розкладу

// Для 1-го курсу:
app.get("/schedule/firstYear", async (req, res) => {
  try {
    const result = await schedulePool.query(GET_SCHEDULE_QUERY_FIRST_YEAR);
    console.log(result);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
});

// Для 2-го курсу:
app.get("/schedule/secondYear", async (req, res) => {
  try {
    const result = await schedulePool.query(GET_SCHEDULE_QUERY_SECOND_YEAR);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
});

// Для 3-го курсу:
app.get("/schedule/thirdYear", async (req, res) => {
  try {
    const result = await schedulePool.query(GET_SCHEDULE_QUERY_THIRD_YEAR);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
});

app.post("/schedule/firstYear", async (req, res) => {
  const { day, hour, subject, teacher, room } = req.body;

  try {
    // Перевіряємо, чи є вже цей предмет у базі
    let subjectResult = await schedulePool.query(
      `SELECT id FROM subjectsFirstYear WHERE name = $1`,
      [subject]
    );

    let subjectId;

    if (subjectResult.rows.length === 0) {
      // Якщо предмету немає, додаємо його з teacher і room
      const newSubjectResult = await schedulePool.query(
        `INSERT INTO subjectsFirstYear (name, teacher, room) 
         VALUES ($1, $2, $3) RETURNING id, teacher, room`,
        [subject, teacher, room]
      );

      subjectId = newSubjectResult.rows[0].id;
    } else {
      subjectId = subjectResult.rows[0].id;
    }

    // Переконайся, що ми беремо teacher і room для предмета
    const subjectInfo = await schedulePool.query(
      `SELECT teacher, room FROM subjectsFirstYear WHERE id = $1`,
      [subjectId]
    );

    const finalTeacher = subjectInfo.rows[0].teacher;
    const finalRoom = subjectInfo.rows[0].room;

    // Додаємо в розклад
    const result = await schedulePool.query(
      `INSERT INTO scheduleFirstYear (day_id, hour_id, subject_id)
       VALUES ((SELECT id FROM days WHERE name = $1),
               (SELECT id FROM hours WHERE time_range = $2),
               $3)
       RETURNING id`,
      [day, hour, subjectId]
    );

    res.json({
      id: result.rows[0].id,
      day,
      hour,
      subject,
      teacher: finalTeacher,
      room: finalRoom,
    });
  } catch (err) {
    console.error("Error adding schedule:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Оновити запис
app.put("/schedule/firstYear/:id", async (req, res) => {
  const { id } = req.params; // ID розкладу, який ми редагуємо
  const { day, hour, subject, teacher, room } = req.body;

  try {
    // Перевіряємо, чи є предмет у базі
    let subjectResult = await schedulePool.query(
      `SELECT id FROM subjectsFirstYear WHERE name = $1`,
      [subject]
    );

    let subjectId;

    if (subjectResult.rows.length === 0) {
      // Якщо предмету ще нема, додаємо його разом із teacher і room
      const newSubjectResult = await schedulePool.query(
        `INSERT INTO subjectsFirstYear (name, teacher, room) 
         VALUES ($1, $2, $3) RETURNING id`,
        [subject, teacher, room]
      );

      subjectId = newSubjectResult.rows[0].id;
    } else {
      subjectId = subjectResult.rows[0].id;

      // Оновлюємо teacher і room для цього предмета (на випадок змін)
      await schedulePool.query(
        `UPDATE subjectsFirstYear SET teacher = $1, room = $2 WHERE id = $3`,
        [teacher, room, subjectId]
      );
    }

    // Оновлюємо сам розклад
    const updateResult = await schedulePool.query(
      `UPDATE scheduleFirstYear 
       SET day_id = (SELECT id FROM days WHERE name = $1), 
           hour_id = (SELECT id FROM hours WHERE time_range = $2),
           subject_id = $3
       WHERE id = $4
       RETURNING id`,
      [day, hour, subjectId, id]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: "Schedule item not found" });
    }

    res.json({
      id,
      day,
      hour,
      subject,
      teacher,
      room,
    });
  } catch (err) {
    console.error("Error updating schedule:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Видалити запис
app.delete("/schedule/firstYear/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await schedulePool.query("DELETE FROM scheduleFirstYear WHERE id = $1;", [
      id,
    ]);
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting schedule", err);
    res.status(500).json({ error: "Database error" });
  }
});

// FOR SECOND YEAR MANIPULATIONS

app.post("/schedule/secondYear", async (req, res) => {
  const { day, hour, subject, teacher, room } = req.body;

  try {
    // Перевіряємо, чи є вже цей предмет у базі
    let subjectResult = await schedulePool.query(
      `SELECT id FROM subjectsSecondYear WHERE name = $1`,
      [subject]
    );

    let subjectId;

    if (subjectResult.rows.length === 0) {
      // Якщо предмету немає, додаємо його з teacher і room
      const newSubjectResult = await schedulePool.query(
        `INSERT INTO subjectsSecondYear (name, teacher, room) 
         VALUES ($1, $2, $3) RETURNING id, teacher, room`,
        [subject, teacher, room]
      );

      subjectId = newSubjectResult.rows[0].id;
    } else {
      subjectId = subjectResult.rows[0].id;
    }

    // Переконайся, що ми беремо teacher і room для предмета
    const subjectInfo = await schedulePool.query(
      `SELECT teacher, room FROM subjectsSecondYear WHERE id = $1`,
      [subjectId]
    );

    const finalTeacher = subjectInfo.rows[0].teacher;
    const finalRoom = subjectInfo.rows[0].room;

    // Додаємо в розклад
    const result = await schedulePool.query(
      `INSERT INTO scheduleSecondYear (day_id, hour_id, subject_id)
       VALUES ((SELECT id FROM days WHERE name = $1),
               (SELECT id FROM hours WHERE time_range = $2),
               $3)
       RETURNING id`,
      [day, hour, subjectId]
    );

    res.json({
      id: result.rows[0].id,
      day,
      hour,
      subject,
      teacher: finalTeacher,
      room: finalRoom,
    });
  } catch (err) {
    console.error("Error adding schedule:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/schedule/secondYear/:id", async (req, res) => {
  const { id } = req.params; // ID розкладу, який ми редагуємо
  const { day, hour, subject, teacher, room } = req.body;

  try {
    // Перевіряємо, чи є предмет у базі
    let subjectResult = await schedulePool.query(
      `SELECT id FROM subjectsSecondYear WHERE name = $1`,
      [subject]
    );

    let subjectId;

    if (subjectResult.rows.length === 0) {
      // Якщо предмету ще нема, додаємо його разом із teacher і room
      const newSubjectResult = await schedulePool.query(
        `INSERT INTO subjectsSecondYear (name, teacher, room) 
         VALUES ($1, $2, $3) RETURNING id`,
        [subject, teacher, room]
      );

      subjectId = newSubjectResult.rows[0].id;
    } else {
      subjectId = subjectResult.rows[0].id;

      // Оновлюємо teacher і room для цього предмета (на випадок змін)
      await schedulePool.query(
        `UPDATE subjectsSecondYear SET teacher = $1, room = $2 WHERE id = $3`,
        [teacher, room, subjectId]
      );
    }

    // Оновлюємо сам розклад
    const updateResult = await schedulePool.query(
      `UPDATE scheduleSecondYear 
       SET day_id = (SELECT id FROM days WHERE name = $1), 
           hour_id = (SELECT id FROM hours WHERE time_range = $2),
           subject_id = $3
       WHERE id = $4
       RETURNING id`,
      [day, hour, subjectId, id]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: "Schedule item not found" });
    }

    res.json({
      id,
      day,
      hour,
      subject,
      teacher,
      room,
    });
  } catch (err) {
    console.error("Error updating schedule:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Видалити запис
app.delete("/schedule/secondYear/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await schedulePool.query("DELETE FROM scheduleSecondYear WHERE id = $1;", [
      id,
    ]);
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting schedule", err);
    res.status(500).json({ error: "Database error" });
  }
});

// FOR THIRD YEAR MANIPULATIONS

app.post("/schedule/thirdYear", async (req, res) => {
  const { day, hour, subject, teacher, room } = req.body;

  try {
    // Перевіряємо, чи є вже цей предмет у базі
    let subjectResult = await schedulePool.query(
      `SELECT id FROM subjects WHERE name = $1`,
      [subject]
    );

    let subjectId;

    if (subjectResult.rows.length === 0) {
      // Якщо предмету немає, додаємо його з teacher і room
      const newSubjectResult = await schedulePool.query(
        `INSERT INTO subjects (name, teacher, room) 
         VALUES ($1, $2, $3) RETURNING id, teacher, room`,
        [subject, teacher, room]
      );

      subjectId = newSubjectResult.rows[0].id;
    } else {
      subjectId = subjectResult.rows[0].id;
    }

    // Переконайся, що ми беремо teacher і room для предмета
    const subjectInfo = await schedulePool.query(
      `SELECT teacher, room FROM subjects WHERE id = $1`,
      [subjectId]
    );

    const finalTeacher = subjectInfo.rows[0].teacher;
    const finalRoom = subjectInfo.rows[0].room;

    // Додаємо в розклад
    const result = await schedulePool.query(
      `INSERT INTO scheduleThirdYear (day_id, hour_id, subject_id)
       VALUES ((SELECT id FROM days WHERE name = $1),
               (SELECT id FROM hours WHERE time_range = $2),
               $3)
       RETURNING id`,
      [day, hour, subjectId]
    );

    res.json({
      id: result.rows[0].id,
      day,
      hour,
      subject,
      teacher: finalTeacher,
      room: finalRoom,
    });
  } catch (err) {
    console.error("Error adding schedule:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/schedule/thirdYear/:id", async (req, res) => {
  const { id } = req.params; // ID розкладу, який ми редагуємо
  const { day, hour, subject, teacher, room } = req.body;

  try {
    // Перевіряємо, чи є предмет у базі
    let subjectResult = await schedulePool.query(
      `SELECT id FROM subjects WHERE name = $1`,
      [subject]
    );

    let subjectId;

    if (subjectResult.rows.length === 0) {
      // Якщо предмету ще нема, додаємо його разом із teacher і room
      const newSubjectResult = await schedulePool.query(
        `INSERT INTO subjects (name, teacher, room) 
         VALUES ($1, $2, $3) RETURNING id`,
        [subject, teacher, room]
      );

      subjectId = newSubjectResult.rows[0].id;
    } else {
      subjectId = subjectResult.rows[0].id;

      // Оновлюємо teacher і room для цього предмета (на випадок змін)
      await schedulePool.query(
        `UPDATE subjects SET teacher = $1, room = $2 WHERE id = $3`,
        [teacher, room, subjectId]
      );
    }

    // Оновлюємо сам розклад
    const updateResult = await schedulePool.query(
      `UPDATE scheduleThirdYear 
       SET day_id = (SELECT id FROM days WHERE name = $1), 
           hour_id = (SELECT id FROM hours WHERE time_range = $2),
           subject_id = $3
       WHERE id = $4
       RETURNING id`,
      [day, hour, subjectId, id]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: "Schedule item not found" });
    }

    res.json({
      id,
      day,
      hour,
      subject,
      teacher,
      room,
    });
  } catch (err) {
    console.error("Error updating schedule:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Видалити запис
app.delete("/schedule/thirdYear/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await schedulePool.query("DELETE FROM scheduleThirdYear WHERE id = $1;", [
      id,
    ]);
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting schedule", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(8081, () => {
  console.log("Server running on port 8081");
});
