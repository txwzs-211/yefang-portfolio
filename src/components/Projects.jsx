import { useState } from 'react';
import { projects } from '../data/projects';
import { useReveal } from '../hooks/useReveal';
import ProjectModal from './ProjectModal';

function FlowSteps({ flow }) {
  return (
    <div className="proj-card-flow">
      {flow.map((step, i) => (
        <span key={i} className="proj-card-flow-item">
          <span className="proj-card-flow-dot" />
          {step}
          {i < flow.length - 1 && <span className="proj-card-flow-arrow">→</span>}
        </span>
      ))}
    </div>
  );
}

function ProjectCard({ project, index, onOpen }) {
  return (
    <div
      className="proj-card reveal"
      style={{ transitionDelay: `${(index % 2) * 0.1}s` }}
      onClick={() => onOpen(project.id)}
    >
      <div className="proj-card-header">
        <span className="proj-card-num">{String(index + 1).padStart(2, '0')}</span>
        <span className="proj-card-tag">{project.tag}</span>
      </div>

      <h3 className="proj-card-title">{project.title}</h3>
      <p className="proj-card-tagline">{project.tagline}</p>

      <FlowSteps flow={project.flow} />

      <div className="proj-card-footer">
        <div className="proj-card-tech">
          {project.tech.map((t) => (
            <span key={t} className="proj-tech-chip liquid-glass">{t}</span>
          ))}
        </div>
        <div className="proj-card-cta">
          查看详情
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const ref = useReveal();
  const [activeId, setActiveId] = useState(null);

  return (
    <section className="section projects" id="projects" ref={ref}>
      <div className="projects-inner">
        <div className="projects-head">
          <div>
            <div className="projects-label reveal">Technical Projects</div>
            <h2 className="projects-title reveal">技术项目</h2>
          </div>
          <p className="projects-desc reveal">
            AI 工程落地 · 工作流设计 · 工具开发 — 把方法论变成可交付的产品与工具。
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((proj, i) => (
            <ProjectCard key={proj.id} project={proj} index={i} onOpen={setActiveId} />
          ))}
        </div>
      </div>

      <ProjectModal projectId={activeId} onClose={() => setActiveId(null)} />
    </section>
  );
}
