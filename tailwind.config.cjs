/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      // Two skins, each with a dark and a light mode, swapped by CSS variables
      // in globals.css. The lab (Breaking Bad, the default): near-black green
      // and lab-coat white, element green as the accent (frost), hazard
      // yellow for tape and warnings (bandana), crystal blue for purity only.
      // Red Dead: Ambarino (dark: pine night, snow and frost) and Wanted
      // (light: bone paper, black ink and stamp red). Text on frost is always
      // ink. No orange, amber or sepia in either.
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        graphite: "rgb(var(--graphite) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        mist: "rgb(var(--mist) / <alpha-value>)",
        smoke: "rgb(var(--smoke) / <alpha-value>)",
        dim: "rgb(var(--dim) / <alpha-value>)",
        frost: "rgb(var(--frost) / <alpha-value>)",
        bandana: "rgb(var(--bandana) / <alpha-value>)",
        crystal: "rgb(var(--crystal) / <alpha-value>)",
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
        // The lab's type: element tiles and body (Archivo), tape and tags (Big Shoulders Stencil).
        archivo: ["Archivo", "Helvetica", "Arial", "sans-serif"],
        stencil: ['"Big Shoulders Stencil"', "Impact", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [
    // light:… applies in the light mode of either skin.
    ({ addVariant }) => addVariant("light", ':is([data-theme="light"] &)'),
    // bb:… applies in the lab skin, rdr2:… in the frontier skin.
    ({ addVariant }) => addVariant("bb", ':is([data-skin="bb"] &)'),
    ({ addVariant }) => addVariant("rdr2", ':is([data-skin="rdr2"] &)'),
  ],
};
