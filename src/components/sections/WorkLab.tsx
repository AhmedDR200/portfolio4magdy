import { useState } from "react";
import { projects } from "../../constants";
import type { TProject } from "../../types";
import Arrow from "../atoms/Arrow";

const WorkLab = ({ onOpenCase }: { onOpenCase: (project: TProject) => void }) => {
  const [selected, setSelected] = useState(0);
  const project = projects[selected];
  if (!project) return null;
  return (
    <div className="lab-work-archive" data-xray="projects">
      <div className="lab-archive-heading"><span>PROJECT INDEX / {String(projects.length).padStart(2, "0")} RECORDS</span><span>SELECT A FILE TO INVESTIGATE <Arrow dir="down" /></span></div>
      <div className="lab-work-grid">
        <ul className="lab-project-list" aria-label="Selected projects">
          {projects.map((item, i) => {
            const details = <>
              <span className="lab-project-number">{String(i + 1).padStart(2, "0")}</span>
              <span className="lab-project-content">
                <span className="lab-project-category">{item.category}</span>
                <span className="lab-project-title">{item.name}</span>
                <span className="lab-project-tags">{item.tags.slice(0, 3).join(" / ")}</span>
                {item.metric && <span className="lab-project-mobile-metric"><b>{item.metric.value}</b> {item.metric.label}</span>}
              </span>
              <span className="lab-project-open"><Arrow dir={item.caseStudy ? "enter" : "up-right"} /></span>
              <span className="sr-only">{item.caseStudy ? "Open case study" : "Visit website, opens in a new tab"}</span>
            </>;
            const shared = { className: "lab-project-row", "aria-label": `${item.name} — ${item.caseStudy ? "Open case study" : "Visit website, opens in a new tab"}`, onPointerEnter: () => setSelected(i), onFocus: () => setSelected(i) };
            return <li key={item.name} data-selected={selected === i}>
              {item.caseStudy ? <button type="button" onClick={() => onOpenCase(item)} {...shared}>{details}</button> : <a href={item.sourceCodeLink} target="_blank" rel="noopener noreferrer" {...shared}>{details}</a>}
            </li>;
          })}
        </ul>
        <aside className="lab-specimen" aria-label="Selected project preview">
          <div className="lab-specimen-header"><span>EXHIBIT {String(selected + 1).padStart(2, "0")}</span><span>PROJECT EVIDENCE</span></div>
          <div className="lab-specimen-image" key={project.image}><img src={project.image} alt={`${project.name} logo`} loading="lazy" /><span aria-hidden="true" className="lab-specimen-cross lab-specimen-cross--tl" /><span aria-hidden="true" className="lab-specimen-cross lab-specimen-cross--br" /></div>
          <div className="lab-specimen-caption">
            <span className="lab-micro-label">OBSERVED IMPACT</span>
            {project.metric && <p><strong>{project.metric.value}</strong><span>{project.metric.label}</span></p>}
          </div>
          <p className="lab-specimen-description">{project.description}</p>
          <div className="lab-specimen-footer"><span>{project.caseStudy ? "CASE STUDY AVAILABLE" : "EXTERNAL PROJECT"}</span><span>AM / {String(selected + 1).padStart(2, "0")}</span></div>
        </aside>
      </div>
    </div>
  );
};

export default WorkLab;
