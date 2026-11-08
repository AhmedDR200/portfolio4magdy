import { motion } from "framer-motion";
import { config } from "../../constants/config";
import { fadeUp } from "../../utils/motion";
import { travelOnClick } from "../../utils/travel";
import Arrow from "../atoms/Arrow";
import ElementTile from "../atoms/ElementTile";

const SystemSketch = () => (
  <div className="lab-system" role="img" aria-label="Architecture sketch: clients connect to an API, which connects to a database and a queue; a worker processes queued jobs.">
    <div className="lab-system-label"><span>SYSTEM STUDY / 01</span><span>NOT TO SCALE</span></div>
    <svg viewBox="0 0 390 290" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.2">
        <path d="M100 76H155M237 76H290V204H238M195 105V172M155 204H100V76" />
        <path d="m149 72 6 4-6 4m42 86 4 6 4-6m45 28-6 4 6 4" />
        <rect x="22" y="48" width="78" height="56" rx="3" />
        <rect x="155" y="43" width="82" height="62" rx="3" />
        <rect x="155" y="172" width="83" height="62" rx="3" />
        <path d="M290 76h28M318 55v42c0 12 55 12 55 0V55M318 55c0-12 55-12 55 0s-55 12-55 0Z" />
        <path d="M100 76V140H61V174" strokeDasharray="4 4" />
        <rect x="22" y="174" width="78" height="60" rx="3" />
      </g>
      <g fill="currentColor" fontFamily="monospace" fontSize="12" textAnchor="middle">
        <text x="61" y="81">CLIENT</text><text x="196" y="80" fontWeight="700">API</text><text x="345" y="85">DB</text>
        <text x="61" y="208">WORKER</text><text x="196" y="208">QUEUE</text>
        <text x="124" y="65" fontSize="8">REST</text><text x="218" y="143" fontSize="8">ASYNC</text>
      </g>
      <circle cx="195" cy="137" r="3.5" fill="#197344" />
      <circle cx="128" cy="76" r="3.5" fill="#197344" />
      <text x="22" y="272" fill="currentColor" fontFamily="monospace" fontSize="9" letterSpacing="1">ONE RESPONSIBILITY. EVERY CONNECTION.</text>
    </svg>
    <div className="lab-system-note">The interesting part is what<br />happens behind the interface.</div>
  </div>
);

const AboutLab = ({ date }: { date: string }) => (
  <section id="about" className="lab-about">
    <div className="lab-shell">
      <motion.article className="lab-dossier" variants={fadeUp(0.05)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }}>
        <header className="lab-dossier-header">
          <div><ElementTile symbol="Ab" number="01" size={44} tone="outline" /><span>THE ENGINEER<br /><b>BACKGROUND & METHODS</b></span></div>
          <span>CAIRO / {date.toUpperCase()}</span>
        </header>
        <div className="lab-dossier-body">
          <div className="lab-dossier-copy">
            <span className="lab-paper-label">A LITTLE BACKGROUND</span>
            <h2>Good systems.<br /><span>No loose ends.</span></h2>
            <p className="lab-dossier-lead">{config.about.statement}</p>
            <p>{config.about.body}</p>
            <p lang="ar" dir="rtl" className="lab-dossier-arabic">{config.about.statementAr}</p>
          </div>
          <aside className="lab-dossier-aside">
            <span className="lab-dossier-stamp">FIELD NOTES<br /><b>ENGINEERING</b></span>
            <SystemSketch />
          </aside>
        </div>
        <dl className="lab-dossier-facts">
          <div><dt>01 / DISCIPLINE</dt><dd>Backend & system design</dd></div>
          <div><dt>02 / CURRENT CHAPTER</dt><dd>Madkhol Capital</dd></div>
          <div><dt>03 / SIDE PROJECT</dt><dd>Building Bee3a</dd></div>
        </dl>
        <footer className="lab-dossier-footer"><span>PERSONNEL FILE / AM–012</span><a href="#experience" onClick={travelOnClick("experience")}>Follow the experience <Arrow dir="right" /></a></footer>
      </motion.article>
    </div>
  </section>
);

export default AboutLab;
