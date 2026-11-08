import { AnimatePresence, motion } from "framer-motion";
import { config } from "../../constants/config";
import { EASE_OUT_CUBIC } from "../../utils/motion";
import { travelOnClick } from "../../utils/travel";
import Arrow from "../atoms/Arrow";
import ElementTile from "../atoms/ElementTile";
import Icon from "../atoms/Icon";
import LabBadge from "../atoms/LabBadge";
import HudLab from "../layout/HudLab";
import Navbar from "../layout/Navbar";

type Props = {
  startHidden: boolean;
  revealed: boolean;
  role: string;
  onMenu: () => void;
  onMap: () => void;
  onWheel: () => void;
  onJournal: () => void;
};

const HeroLab = ({ startHidden, revealed, role, onMenu, onMap, onWheel, onJournal }: Props) => (
  <motion.section
    id="top"
    aria-labelledby="lab-hero-title"
    className="lab-hero"
    style={{ transformOrigin: "50% 100%" }}
    initial={startHidden ? { y: 160, scale: 0.88 } : false}
    animate={revealed ? { y: 0, scale: 1 } : undefined}
    transition={{ duration: 0.9, ease: EASE_OUT_CUBIC }}
  >
    <div className="lab-grid lab-hero-grid" aria-hidden="true" />
    <Navbar onMenu={onMenu} ready={revealed} />
    <div className="lab-shell">
      <div className="lab-file-line">
        <span><span className="lab-status-dot" /> INDEPENDENT ENGINEER / CAIRO, EG</span>
        <span>PERSONNEL FILE <b>012</b></span>
      </div>
      <div className="lab-hero-body">
        <div className="lab-hero-copy">
          <div className="lab-division">
            <ElementTile symbol="Br" number="35" size={42} tone="outline" />
            <span>THE LABORATORY OF<br /><b>BACKEND ENGINEERING</b></span>
          </div>
          <h1 id="lab-hero-title">AHMED<br /><span>MAGDY<span className="lab-name-period">.</span></span></h1>
          <div className="lab-specialty">
            <span>BACKEND ENGINEER</span>
            <span aria-hidden="true" className="lab-specialty-slash">/</span>
            <span className="lab-role-window">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={role} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={{ duration: 0.3 }}>
                  {role}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
          <p className="lab-hero-summary">Turning complex problems into scalable systems.<br className="hidden sm:block" /> Clean APIs. Reliable services. Nothing left to chance.</p>
          <p lang="ar" dir="rtl" className="lab-hero-arabic">مهندس باك إند. والتفاصيل بتفرق.</p>
          <div className="lab-actions">
            <a href="#work" onClick={travelOnClick("work")} className="lab-button lab-button--solid">Explore the work <Arrow dir="up-right" /></a>
            <a href="#about" onClick={travelOnClick("about")} className="lab-button lab-button--line">Meet the engineer <Arrow dir="right" /></a>
          </div>
          <a href={config.currentRole.url} target="_blank" rel="noopener noreferrer" className="lab-current-role">
            <span className="lab-status-dot" /> CURRENTLY <strong>{config.currentRole.title}</strong><Arrow dir="up-right" />
          </a>
        </div>
        <div className="lab-hero-portrait">
          <span className="lab-portrait-coordinate" aria-hidden="true">30.0444° N / 31.2357° E</span>
          <div className="lab-portrait-frame"><LabBadge className="lab-personnel-badge" /></div>
          <p className="lab-portrait-caption"><span>FIG. 01 — THE ENGINEER</span><span>Mg / 12</span></p>
        </div>
      </div>
      <div className="lab-hero-footer">
        <HudLab className="lab-hero-hud flex" onJournal={onJournal} />
        <div className="lab-quick-access">
          <span className="lab-micro-label">EXPLORE THE LAB</span>
          <div>
            <button type="button" onClick={onMap}><Icon name="compass" size={17} /><span>The table</span><kbd>M</kbd></button>
            <button type="button" onClick={onWheel}><Icon name="gear" size={17} /><span>Skills</span><kbd>Tab</kbd></button>
            <button type="button" onClick={onJournal}><Icon name="crates" size={17} /><span>Collection</span><kbd>J</kbd></button>
          </div>
        </div>
      </div>
    </div>
    <div className="lab-hero-tape" aria-hidden="true"><span>PRECISE BY DESIGN</span><span>BUILT FOR PRODUCTION</span><span>HANDLE WITH CARE</span></div>
  </motion.section>
);

export default HeroLab;
