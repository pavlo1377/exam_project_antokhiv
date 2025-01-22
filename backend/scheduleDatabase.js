import pkg from "pg"; // Імпортуємо через default export
const { Pool } = pkg;

const schedulePool = new Pool({
  user: "postgres", // Ім'я користувача PostgreSQL
  host: "localhost", // Адреса сервера бази даних
  database: "university_schedule", // Назва вашої бази даних для розкладу
  password: "0671860909", // Пароль користувача
  port: 5432,
});

export default schedulePool; // Експортуємо підключення до бази даних розкладу
