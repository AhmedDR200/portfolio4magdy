/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      // Volt palette. Text on volt is always ink.
      colors: {
        ink: "#0A0A0A",
        graphite: "#1C1C1C",
        paper: "#F4F4EF",
        mist: "#C9C9C2",
        smoke: "#8C8C86",
        dim: "#6A6A64",
        volt: "#D4FF3A",
      },
      fontFamily: {
        // Anton is display-only: headings, always uppercase.
        display: ["Anton", "Impact", '"Arial Narrow"', "sans-serif"],
        arabic: ["Rakkas", "serif"],
        // Bee3a's own UI font, only inside the Bee3a demo.
        bee3a: ["Alexandria", "sans-serif"],
        // ٢٠٠ تمام's own display font, only in the channel section.
        kufi: ['"Reem Kufi"', "sans-serif"],
        // Woodtype for the western touches (WANTED poster, map, achievements).
        western: ["Rye", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [],
};
