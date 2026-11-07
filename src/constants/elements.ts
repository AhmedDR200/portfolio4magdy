// The 118 elements, in atomic-number order (z = index + 1).
const RAW =
  "H Hydrogen,He Helium,Li Lithium,Be Beryllium,B Boron,C Carbon,N Nitrogen,O Oxygen,F Fluorine,Ne Neon,Na Sodium,Mg Magnesium,Al Aluminium,Si Silicon,P Phosphorus,S Sulfur,Cl Chlorine,Ar Argon,K Potassium,Ca Calcium,Sc Scandium,Ti Titanium,V Vanadium,Cr Chromium,Mn Manganese,Fe Iron,Co Cobalt,Ni Nickel,Cu Copper,Zn Zinc,Ga Gallium,Ge Germanium,As Arsenic,Se Selenium,Br Bromine,Kr Krypton,Rb Rubidium,Sr Strontium,Y Yttrium,Zr Zirconium,Nb Niobium,Mo Molybdenum,Tc Technetium,Ru Ruthenium,Rh Rhodium,Pd Palladium,Ag Silver,Cd Cadmium,In Indium,Sn Tin,Sb Antimony,Te Tellurium,I Iodine,Xe Xenon,Cs Caesium,Ba Barium,La Lanthanum,Ce Cerium,Pr Praseodymium,Nd Neodymium,Pm Promethium,Sm Samarium,Eu Europium,Gd Gadolinium,Tb Terbium,Dy Dysprosium,Ho Holmium,Er Erbium,Tm Thulium,Yb Ytterbium,Lu Lutetium,Hf Hafnium,Ta Tantalum,W Tungsten,Re Rhenium,Os Osmium,Ir Iridium,Pt Platinum,Au Gold,Hg Mercury,Tl Thallium,Pb Lead,Bi Bismuth,Po Polonium,At Astatine,Rn Radon,Fr Francium,Ra Radium,Ac Actinium,Th Thorium,Pa Protactinium,U Uranium,Np Neptunium,Pu Plutonium,Am Americium,Cm Curium,Bk Berkelium,Cf Californium,Es Einsteinium,Fm Fermium,Md Mendelevium,No Nobelium,Lr Lawrencium,Rf Rutherfordium,Db Dubnium,Sg Seaborgium,Bh Bohrium,Hs Hassium,Mt Meitnerium,Ds Darmstadtium,Rg Roentgenium,Cn Copernicium,Nh Nihonium,Fl Flerovium,Mc Moscovium,Lv Livermorium,Ts Tennessine,Og Oganesson";

export type Element = { z: number; symbol: string; name: string };

export const ELEMENTS: Element[] = RAW.split(",").map((entry, i) => {
  const [symbol, name] = entry.split(" ");
  return { z: i + 1, symbol, name };
});

const BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.symbol.toLowerCase(), e]));

export type SpellToken = { element: Element } | { gap: string };

/**
 * Spells a name with element symbols. Dynamic programming from the end: the
 * best spelling of letters[i..] is the one that turns the most letters into
 * elements, then uses the fewest tiles. A letter the table can't take becomes
 * a gap, so a name that doesn't fully spell still shows what does.
 */
export const spellName = (name: string): { tokens: SpellToken[]; matched: number; letters: number } => {
  const letters = name.toLowerCase().replace(/[^a-z]/g, "");
  const L = letters.length;
  type Best = { score: number; tokens: SpellToken[] };
  const best: Best[] = new Array(L + 2);
  best[L] = { score: 0, tokens: [] };
  best[L + 1] = { score: -1, tokens: [] };
  for (let i = L - 1; i >= 0; i--) {
    let pick: Best = { score: best[i + 1].score, tokens: [{ gap: letters[i] } as SpellToken].concat(best[i + 1].tokens) };
    const one = BY_SYMBOL.get(letters[i]);
    if (one && best[i + 1].score + 1 > pick.score) {
      pick = { score: best[i + 1].score + 1, tokens: [{ element: one } as SpellToken].concat(best[i + 1].tokens) };
    }
    if (i + 2 <= L) {
      const two = BY_SYMBOL.get(letters.substr(i, 2));
      if (two) {
        const score = best[i + 2].score + 2;
        if (score > pick.score || (score === pick.score && pick.tokens.length > best[i + 2].tokens.length + 1)) {
          pick = { score, tokens: [{ element: two } as SpellToken].concat(best[i + 2].tokens) };
        }
      }
    }
    best[i] = pick;
  }
  return { tokens: L ? best[0].tokens : [], matched: L ? best[0].score : 0, letters: L };
};

/** The stack as a periodic table: each tool's symbol. Several are invented where no real element fits. */
export const TOOL_SYMBOLS: Record<string, string> = {
  TypeScript: "Ts",
  JavaScript: "Js",
  Python: "Py",
  "C#": "Cs",
  "Node.js": "Nd",
  NestJS: "Ne",
  Express: "Ex",
  FastAPI: "Fa",
  Bun: "Bu",
  Flask: "Fl",
  Django: "Dj",
  MongoDB: "Mo",
  MySQL: "My",
  Redis: "Re",
  PostgreSQL: "Pg",
  Prisma: "Pr",
  TypeORM: "To",
  Mongoose: "Mn",
  Sequelize: "Sq",
  WebSockets: "Ws",
  "Socket.io": "So",
  RabbitMQ: "Rb",
  "Redis pub/sub": "Rp",
  Pusher: "Pu",
  Docker: "Dk",
  Kubernetes: "Ks",
  AWS: "Aw",
  "Cloudflare Workers": "Cw",
  "GitHub Actions": "Ga",
  Linux: "Lx",
  Prometheus: "Pm",
  GPT: "Gp",
  Gemini: "Ge",
  "Workers AI": "Wa",
  Zapier: "Zp",
  Git: "Gt",
  Postman: "Po",
  Swagger: "Sw",
  GraphQL: "Gq",
  Bash: "Ba",
  React: "Rc",
  PWA: "Pw",
  Remotion: "Rm",
};

/** A symbol for any tool name: the table above, else its first two letters. */
export const toolSymbol = (tool: string) => TOOL_SYMBOLS[tool] ?? tool.replace(/[^A-Za-z]/g, "").slice(0, 2).replace(/^./, (c) => c.toUpperCase());
