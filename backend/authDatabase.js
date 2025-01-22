import pkg from "pg"; // Імпортуємо через default export
const { Pool } = pkg;

const authPool = new Pool({
  user: "postgres", // Ім'я користувача PostgreSQL
  host: "localhost", // Адреса сервера бази даних
  database: "auth", // Назва вашої бази даних для авторизації
  password: "0671860909", // Пароль користувача
  port: 5432,
});

export default authPool; // Експортуємо підключення до бази даних авторизації
