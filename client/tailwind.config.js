/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        primary : "#3db1f9",
        secondary : "#157ebf"
      }
    },
  },
  plugins: [],
}