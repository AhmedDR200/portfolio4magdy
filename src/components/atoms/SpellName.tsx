import { useEffect, useMemo, useState } from "react";

import { spellName } from "../../constants/elements";
import ElementTile from "./ElementTile";

// Spell your name in the periodic table (the lab's contact-episode toy). The
// speller turns as many letters as it can into element symbols, fewest tiles
// first, and shows the letters the table can't take as dashed gaps. A name can
// be saved as an image or shared as a link (?spell=Name).

const EXAMPLES = ["Sherif", "Nora", "Ali", "Ahmed"];
const DEFAULT = "Sherif";

const initialName = () => {
  try {
    const q = new URLSearchParams(window.location.search).get("spell");
    if (q) return q.slice(0, 14);
  } catch {
    // No URL to read.
  }
  return DEFAULT;
};

/** Tiles are 76 px on phones and 104 px from sm up. */
const useTileSize = () => {
  const [size, setSize] = useState(() => (window.matchMedia("(min-width: 640px)").matches ? 104 : 76));
  useEffect(() => {
    const q = window.matchMedia("(min-width: 640px)");
    const on = () => setSize(q.matches ? 104 : 76);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return size;
};

const saveImage = async (tokens: ReturnType<typeof spellName>["tokens"], name: string) => {
  const T = 120;
  const G = 14;
  const P = 44;
  const w = Math.max(1, tokens.length) * (T + G) - G + P * 2;
  const h = T + P * 2 + 36;
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = w * scale;
  canvas.height = h * scale;
  const g = canvas.getContext("2d");
  if (!g) return;
  try {
    await Promise.all([document.fonts.load("800 56px Archivo"), document.fonts.load("700 14px Archivo"), document.fonts.load("500 12px 'JetBrains Mono'")]);
  } catch {
    // Fonts fall back.
  }
  g.scale(scale, scale);
  g.fillStyle = "#0A100D";
  g.fillRect(0, 0, w, h);
  g.textBaseline = "alphabetic";
  tokens.forEach((t, i) => {
    const x = P + i * (T + G);
    const y = P;
    if ("element" in t) {
      g.strokeStyle = "#4FD17F";
      g.lineWidth = 3;
      g.strokeRect(x + 1.5, y + 1.5, T - 3, T - 3);
      g.fillStyle = "#4FD17F";
      g.font = "700 14px Archivo, Helvetica, Arial, sans-serif";
      g.textAlign = "left";
      g.fillText(String(t.element.z), x + 10, y + 24);
      g.fillStyle = "#E9F0E4";
      g.font = "800 56px Archivo, Helvetica, Arial, sans-serif";
      g.textAlign = "center";
      g.fillText(t.element.symbol, x + T / 2, y + 74);
      g.font = "600 11px Archivo, Helvetica, Arial, sans-serif";
      g.fillStyle = "#C0CBBE";
      g.fillText(t.element.name, x + T / 2, y + T - 12);
    } else {
      g.setLineDash([6, 5]);
      g.strokeStyle = "#3A4A40";
      g.lineWidth = 2;
      g.strokeRect(x + 1, y + 1, T - 2, T - 2);
      g.setLineDash([]);
      g.fillStyle = "#5E6E62";
      g.font = "700 46px Archivo, Helvetica, Arial, sans-serif";
      g.textAlign = "center";
      g.fillText(t.gap.toUpperCase(), x + T / 2, y + 74);
    }
  });
  g.fillStyle = "#8A9A8C";
  g.font = "500 12px 'JetBrains Mono', monospace";
  g.textAlign = "left";
  g.fillText(`${name.toUpperCase()} · SPELLED IN ELEMENTS · MAGDY.DIGITAL`, P, h - 22);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "name"}-elements.png`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, "image/png");
};

const SpellName = () => {
  const [name, setName] = useState(initialName);
  const [copied, setCopied] = useState(false);
  const size = useTileSize();
  const { tokens, matched, letters } = useMemo(() => spellName(name), [name]);

  let summary = "Type a name to start.";
  let summaryAr = "اكتب اسمك وشوف.";
  if (letters && matched === letters) {
    summary = `Spelled with ${tokens.length} element${tokens.length === 1 ? "" : "s"}. Every letter found a home.`;
    summaryAr = "كل حرف لقى مكانه.";
  } else if (letters) {
    summary = `${matched} of ${letters} letters are elements. The dashed tiles are the ones the table could not take.`;
    summaryAr = "المربعات المنقّطة حروف الجدول ماقدرش ياخدها.";
  }

  const copyLink = async () => {
    const url = `${window.location.origin}/?spell=${encodeURIComponent(name.trim())}#contact`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link", url);
    }
  };

  const btnSolid =
    "h-11 bg-frost px-5 font-archivo text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40";
  const btnLine =
    "h-11 border-[1.5px] border-smoke px-5 font-archivo text-[13px] font-bold uppercase tracking-[0.12em] text-paper transition-colors hover:border-frost hover:text-frost disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="mt-24 sm:mt-32">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[12px] tracking-[0.16em] text-smoke">IN THE CONTACT EPISODE · SPELL IT</span>
          <h3 className="m-0 font-display text-[clamp(40px,6.4vw,84px)] font-normal uppercase leading-[0.95]">Your name, in elements</h3>
        </div>
        <span lang="ar" dir="rtl" className="font-arabic text-[26px] text-mist sm:text-[34px]">
          اتهجّى اسمك بالعناصر
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="spell-name" className="font-mono text-[12px] tracking-[0.16em] text-smoke">
              TYPE A NAME. LATIN LETTERS.
            </label>
            <input
              id="spell-name"
              type="text"
              value={name}
              maxLength={14}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setName(e.target.value)}
              // The site's one-key shortcuts must not fire while a name is typed.
              onKeyDown={(e) => e.stopPropagation()}
              className="h-[60px] w-full border-2 border-frost bg-graphite px-5 font-archivo text-[28px] font-extrabold tracking-[-0.01em] text-paper outline-none focus:shadow-[0_0_0_4px_rgb(var(--frost)/0.22)] sm:h-[76px] sm:px-[22px] sm:text-[44px]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="mr-1 font-mono text-[11px] tracking-[0.12em] text-smoke">TRY</span>
            {EXAMPLES.map((ex) => {
              const current = ex.toLowerCase() === name.trim().toLowerCase();
              return (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setName(ex)}
                  aria-pressed={current}
                  className={`h-11 border-[1.5px] px-4 font-archivo text-[14px] font-bold transition-colors ${
                    current ? "border-frost bg-frost text-ink" : "border-dim text-paper hover:border-frost"
                  }`}
                >
                  {ex}
                </button>
              );
            })}
          </div>

          <ul aria-label={`${name} in elements`} className="m-0 flex min-h-[132px] list-none flex-wrap content-start gap-2.5 p-0 sm:min-h-[240px] sm:gap-3">
            {tokens.map((t, i) => (
              <li key={`${i}-${"element" in t ? t.element.symbol : t.gap}`} className="flex">
                {"element" in t ? (
                  <ElementTile symbol={t.element.symbol} number={t.element.z} name={t.element.name} size={size} tone="outline" />
                ) : (
                  <span
                    style={{ width: size, height: size }}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-dim/70 font-archivo text-dim"
                    aria-label={`${t.gap}: no element`}
                  >
                    <span className="font-bold leading-none" style={{ fontSize: size * 0.42 }}>
                      {t.gap.toUpperCase()}
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pt-4">
            <p className="m-0 flex max-w-[56ch] flex-col gap-0.5 text-[15px] leading-[1.5]" aria-live="polite">
              <span>{summary}</span>
              <span lang="ar" dir="rtl" className="text-left font-arabic text-[18px] text-smoke">
                {summaryAr}
              </span>
            </p>
            <div className="flex flex-none gap-2.5">
              <button type="button" disabled={!letters} onClick={() => void saveImage(tokens, name.trim())} className={btnSolid}>
                Save as image
              </button>
              <button type="button" disabled={!letters} onClick={() => void copyLink()} className={btnLine}>
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </div>
        </div>

        {/* And mine. */}
        <aside className="flex flex-col gap-5 border border-paper/15 bg-graphite p-6 sm:p-7">
          <span className="font-mono text-[12px] tracking-[0.16em] text-smoke">AND MINE</span>
          <div className="flex items-center gap-1.5" aria-label="Ahmed: only the H is an element">
            {[
              ["A", false],
              ["H", true],
              ["m", false],
              ["e", false],
              ["d", false],
            ].map(([l, on]) =>
              on ? (
                <ElementTile key={String(l)} symbol={String(l)} number={1} size={52} tone="outline" />
              ) : (
                <span key={String(l)} className="flex h-[52px] w-[52px] items-center justify-center border-2 border-dashed border-dim/70 font-archivo text-[24px] font-bold text-dim">
                  {l}
                </span>
              )
            )}
          </div>
          <p className="m-0 text-[14px] leading-[1.6] text-mist">
            Ahmed does not spell: only the H is an element. Magdy comes closer, Ag and Dy, but loses its M. So the site&apos;s mark is the one tile that is already mine.
          </p>
          <p lang="ar" dir="rtl" className="m-0 text-left font-arabic text-[18px] text-smoke">
            «أحمد» مبتتهجّاش، و«مجدي» قريبة. فاخدت المربع بتاعي.
          </p>
          <div className="flex items-center gap-5">
            <ElementTile symbol="Mg" number={12} name="Magdy" size={112} tone="solid" />
            <span className="text-[13px] leading-[1.55] text-mist">Element 12 is magnesium. It burns so bright you are told not to look. Close enough.</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SpellName;
