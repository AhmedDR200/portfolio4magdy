/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#0A0E0A",
        secondary: "#4A8055",
        tertiary: "#0F1810",
        "black-100": "#050805",
        "black-200": "#000000",
        "white-100": "#C8FFD0",
        accent: "#00FF88",
        "accent-blue": "#00CC66",
        "accent-cyan": "#00FFAA",
        "accent-green": "#00FF88",
        "accent-orange": "#FFB700",
        "accent-red": "#FF0044",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
      },
    },
  },
  plugins: [],
};
