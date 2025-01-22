/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}", // Вкажіть ваші файли для Tailwind
  ],
  theme: {
    extend: {
      colors: {
        primary: "#006ec0", // Додайте ваш колір із назвою
      },
    },
  },
  plugins: [],
};
