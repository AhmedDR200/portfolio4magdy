/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      // Two themes from RDR2, swapped by CSS variables in globals.css.
      // Dark is Ambarino: pine night, snow and frost. Light is Wanted: bone
      // paper, black ink and stamp red. Text on frost is always ink. Bandana
      // red is kept for seals, low cores and the ledger's margin. No orange,
      // amber or sepia.
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        graphite: "rgb(var(--graphite) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        mist: "rgb(var(--mist) / <alpha-value>)",
        smoke: "rgb(var(--smoke) / <alpha-value>)",
        dim: "rgb(var(--dim) / <alpha-value>)",
        frost: "rgb(var(--frost) / <alpha-value>)",
        bandana: "rgb(var(--bandana) / <alpha-value>)",
      },
      fontFamily: {
        // Anton is display-only: headings, always uppercase.
        display: ["Anton", "Impact", '"Arial Narrow"', "sans-serif"],
        arabic: ["Rakkas", "serif"],
        // Bee3a's own UI font, only inside the Bee3a demo.
        bee3a: ["Alexandria", "sans-serif"],
        // Handwriting, only in the notebook on the Bee3a card.
        ruqaa: ['"Aref Ruqaa"', "serif"],
        // ٢٠٠ تمام's own display font, only in the channel section.
        kufi: ['"Reem Kufi"', "sans-serif"],
        // Woodtype for the western touches (WANTED poster, map, achievements).
        western: ["Rye", "serif"],
        // RDR2's old print: chapter cards, menus, prompts, the ledger.
        fell: ['"IM Fell English"', "Georgia", "serif"],
        fellsc: ['"IM Fell English SC"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [
    // light:… applies in the Wanted (light) theme.
    ({ addVariant }) => addVariant("light", ':is([data-theme="light"] &)'),
  ],
};
