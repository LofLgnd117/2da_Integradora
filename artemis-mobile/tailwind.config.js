/** @type {import('tailwindcss').Config} */
module.exports = {
  // Aquí le decimos que busque clases de Tailwind en App.js y cualquier archivo dentro de /src
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}