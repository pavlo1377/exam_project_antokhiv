import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authPool from "./authDatabase.js"; // Імпортуємо підключення до бази даних авторизації
import schedulePool from "./scheduleDatabase.js"; // Імпортуємо підключення до бази даних розкладу
import { GET_SCHEDULE_QUERY_THIRD_YEAR } from "./queries.js"; // Імпортуємо SQL запит
import { GET_SCHEDULE_QUERY_SECOND_YEAR } from "./queries.js"; // Імпортуємо SQL запит
import { GET_SCHEDULE_QUERY_FIRST_YEAR } from "./queries.js"; // Імпортуємо SQL запит

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// API для авторизації

app.get("/", (req, res) => {
  if (req.session.username) {
    return res.json({ valid: true, username: req.session.username });
  } else {
    return res.json({ valid: false });
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authPool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, password]
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
      "SELECT * FROM users WHERE email = $1 and password = $2",
      [email, password]
    );
    if (result.rows.length > 0) {
      req.session.username = result.rows[0].email;
      console.log(result.rows[0]);
      return res.json({ message: "Login successful", user: result.rows[0] });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    return res.status(500).json({ message: "Error in Node login" });
  }
});

// API для розкладу

app.get("/schedule/thirdYear", async (req, res) => {
  try {
    const result = await schedulePool.query(GET_SCHEDULE_QUERY_THIRD_YEAR); // Запит до бази даних розкладу
    res.json(result.rows); // Відправка результату клієнту у форматі JSON
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
});



app.get("/schedule/secondYear", async (req, res) => {
  try {
    const result = await schedulePool.query(GET_SCHEDULE_QUERY_SECOND_YEAR); // Запит до бази даних розкладу
    res.json(result.rows); // Відправка результату клієнту у форматі JSON
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
});

app.get("/schedule/firstYear", async (req, res) => {
  try {
    const result = await schedulePool.query(GET_SCHEDULE_QUERY_FIRST_YEAR); // Запит до бази даних розкладу
    res.json(result.rows); // Відправка результату клієнту у форматі JSON
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
});

app.listen(8081, () => {
  console.log("Server running successfully on port 8081");
});
