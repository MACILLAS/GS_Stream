/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "navy-blue": "#1a365d",
        "dark-blue": "#0f2340",
        "light-gray": "#f7fafc",
      },
    },
  },
  plugins: [],
};
