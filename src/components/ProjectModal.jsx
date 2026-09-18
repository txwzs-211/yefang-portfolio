import { useEffect } from 'react';
import { projects } from '../data/projects';

/* 图片占位槽 */
function ImgSlot({ slot, label, hint, span }) {
  const hasFile = false; // 图片待提供，始终显示占位
  return (
    <div
      className={`proj-img-slot${span === 2 ? ' proj-img-slot--wide' : ''}`}
      style={{ gridColumn: span === 2 ? 'span 2' : undefined }}
    >
      <div className="proj-img-placeholder">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <span className="proj-img-slot-label">{label}</span>
        {hint && <span className="proj-img-slot-hint">{hint}</span>}
        <span className="proj-img-slot-file">{slot}</span>
      </div>
    </div>
  );
}

/* 流程管线（用于 Skill 模块的八阶段） */
function PipelineViz({ pipeline }) {
  return (
    <div className="proj-pipeline">
      {pipeline.map((node, i) => (
        <div key={i} className="proj-pipeline-node">
          <div className="proj-pipeline-num">{node.num}</div>
          <div className="proj-pipeline-title">{node.title}</div>
          <div className="proj-pipeline-desc">{node.desc}</div>
          {i < pipeline.length - 1 && <div className="proj-pipeline-arrow">→</div>}
        </div>
      ))}
    </div>
  );
}

/* 信息卡片网格 */
function InfoCards({ cards }) {
  return (
    <div className="proj-info-cards">
      {cards.map((c, i) => (
        <div key={i} className="proj-info-card liquid-glass">
          {c.tag && <div className="proj-info-card-tag">{c.tag}</div>}
          <div className="proj-info-card-title">{c.title}</div>
          <div className="proj-info-card-desc">{c.desc}</div>
        </div>
      ))}
    </div>
  );
}

/* 渲染一个 detail section */
function DetailSection({ sec }) {
  return (
    <div className="proj-detail-section">
      <div className="proj-detail-section-head">
        <h3 className="proj-detail-h">{sec.h}</h3>
        {sec.tag && <span className="proj-detail-tag">{sec.tag}</span>}
      </div>
      {sec.p && <p className="proj-detail-p">{sec.p}</p>}
      {sec.pipeline && <PipelineViz pipeline={sec.pipeline} />}
      {sec.cards && <InfoCards cards={sec.cards} />}
    </div>
  );
}

export default function ProjectModal({ projectId, onClose }) {
  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!project) return null;

  const { detail } = project;

  return (
    <div className="proj-modal active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="proj-modal-content">
        {/* 返回按钮 */}
        <button className="proj-modal-back liquid-glass" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          返回
        </button>

        {/* 头部 */}
        <div className="proj-modal-hero">
          <span className="proj-modal-tag">{project.tag}</span>
          <h2 className="proj-modal-title">{project.title}</h2>
          <p className="proj-modal-tagline">{project.tagline}</p>
          <div className="proj-modal-meta">
            <span><strong>职责</strong> {detail.role}</span>
            <span><strong>时间</strong> {detail.time}</span>
          </div>
        </div>

        {/* 流程步骤条（顶部） */}
        <div className="proj-modal-flow">
          <div className="proj-modal-flow-label">项目流程</div>
          <div className="proj-modal-flow-steps">
            {project.flow.map((step, i) => (
              <div key={i} className="proj-modal-flow-step">
                <div className="proj-modal-flow-step-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="proj-modal-flow-step-name">{step}</div>
                {i < project.flow.length - 1 && <div className="proj-modal-flow-arrow" />}
              </div>
            ))}
          </div>
        </div>

        {/* 概述 */}
        <div className="proj-modal-overview">
          <p>{detail.overview}</p>
        </div>

        {/* 详情区块 */}
        <div className="proj-modal-body">
          {detail.sections.map((sec, i) => (
            <DetailSection key={i} sec={sec} />
          ))}
        </div>

        {/* 效果展示区（图片占位） */}
        <div className="proj-modal-showcase">
          <div className="proj-detail-section-head">
            <h3 className="proj-detail-h">效果展示</h3>
            <span className="proj-detail-tag">图片待上传</span>
          </div>
          <div className="proj-img-grid">
            {detail.showcase.map((item, i) => (
              <ImgSlot key={i} {...item} />
            ))}
          </div>
        </div>

        {/* 技术栈 */}
        <div className="proj-modal-tech">
          {project.tech.map((t) => (
            <span key={t} className="proj-tech-chip liquid-glass">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
