import { useState, useRef, useEffect, useCallback } from 'react';
import { useReveal } from '../hooks/useReveal';
import { projects } from '../data/projects';

const base = import.meta.env.BASE_URL;

// 三大分类，每类包含对应的 project ids
const categories = [
  {
    id: 'platform',
    num: '01',
    label: 'AI 平台应用实现',
    en: 'Platform Application',
    desc: '多模型编排与产品化落地，将前沿 AI 能力封装为可稳定交付的应用产品。',
    skills: ['多模型编排', 'ComfyUI 工作流', '提示词工程', '产品化封装'],
    projectIds: ['refine', 'extract'],
  },
  {
    id: 'skill',
    num: '02',
    label: 'AI 影视 Skill 研发',
    en: 'Film Skill Engineering',
    desc: '自研叙事类 AI 视频生成工作流，迭代至 v9，从自然语言到成片全链路自动编排。',
    skills: ['Agent Skill 设计', '八阶段管线', '分镜表编排', '多模型调度'],
    projectIds: ['skill'],
  },
  {
    id: 'tools',
    num: '03',
    label: '工具开发',
    en: 'Tool Engineering',
    desc: '围绕 AI 图像与音频管线，自研配套工程工具，构建稳定可复用的基建闭环。',
    skills: ['Python / Gradio', '图像配准算法', 'Node.js 双端', 'UI 高保真原型'],
    projectIds: ['tools'],
    items: ['构图校正', '比例补边', 'AI 音频工作台'],  // 覆盖 project 标题，直接显示工具名
  },
];

// 图片展示（无文字，可选外部标题）
function ShowcaseImg({ file, wide, caption }) {
  const [err, setErr] = useState(false);
  const src = `${base}assets/${file}`;
  return (
    <div className={`showcase-img-outer${wide ? ' showcase-img-outer--wide' : ''}`}>
      {caption && <div className="showcase-caption">{caption}</div>}
      <div className="showcase-img-wrap">
        {!err ? (
          <img src={src} alt="" onError={() => setErr(true)} className="showcase-img" />
        ) : (
          <div className="showcase-img-placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span className="proj-img-file">{file}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 带自定义控制条的视频展示（含音量+全屏）
function ShowcaseVideo({ file }) {
  const videoRef = useRef(null);
  const barRef   = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [curTime,   setCurTime]   = useState('0:00');
  const [durTime,   setDurTime]   = useState('0:00');
  const [muted,     setMuted]     = useState(false);
  const src = `${base}assets/${file}`;

  const fmt = (s) => {
    if (!isFinite(s)) return '0:00';
    return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => { setProgress(v.duration ? (v.currentTime/v.duration)*100 : 0); setCurTime(fmt(v.currentTime)); };
    const onMeta = () => setDurTime(fmt(v.duration));
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    if (v.readyState >= 1) setDurTime(fmt(v.duration));
    return () => { v.removeEventListener('timeupdate', onTime); v.removeEventListener('loadedmetadata', onMeta); };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setIsPlaying(true); }
    else          { v.pause(); setIsPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const toggleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else (v.requestFullscreen || v.webkitRequestFullscreen || v.mozRequestFullScreen)?.call(v);
  };

  const seek = useCallback((e) => {
    const v = videoRef.current;
    const bar = barRef.current;
    if (!v || !bar) return;
    const rect = bar.getBoundingClientRect();
    v.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * v.duration;
  }, []);

  return (
    <div className="sc-video-wrap">
      <div className="sc-video-player" onClick={togglePlay}>
        <video ref={videoRef} src={src} loop playsInline preload="metadata"
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', cursor:'pointer' }} />
        {!isPlaying && (
          <div className="sc-video-play-hint">
            <div className="sc-video-play-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
            </div>
          </div>
        )}
      </div>
      {/* 自定义控制条 */}
      <div className="sc-vc-bar">
        <button className="sc-vc-btn" onClick={togglePlay}>
          {isPlaying
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
          }
        </button>
        <div ref={barRef} className="sc-vc-track" onClick={seek}>
          <div className="sc-vc-fill" style={{ width: `${progress}%` }} />
          <div className="sc-vc-thumb" style={{ left: `${progress}%` }} />
        </div>
        <div className="sc-vc-time">{curTime} / {durTime}</div>
        <button className="sc-vc-btn" onClick={toggleMute} aria-label={muted ? '取消静音' : '静音'}>
          {muted
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
          }
        </button>
        <button className="sc-vc-btn" onClick={toggleFullscreen} aria-label="全屏">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M21 16v3a2 2 0 01-2 2h-3M3 16v3a2 2 0 002 2h3"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// 分组展示（标题 + 图片网格）
function ShowcaseGroups({ showcase }) {
  if (!showcase || showcase.length === 0) return null;
  return (
    <div className="sc-groups">
      {showcase.map((group, gi) => (
        <div key={gi} className="sc-group">
          <div className="sc-group-label">{group.group}</div>

          {/* 左视频 + 右图片 并排布局 */}
          {group.splitLayout && (
            <div className="sc-split-layout">
              <div className="sc-split-left">
                <ShowcaseVideo file={group.video} />
              </div>
              <div className="sc-split-right">
                <img
                  src={`${base}assets/${group.flowImg}`}
                  alt="完整工作流"
                  className="sc-split-img"
                />
              </div>
            </div>
          )}

          {/* 普通视频 */}
          {!group.splitLayout && group.video && <ShowcaseVideo file={group.video} />}

          {/* 图片网格 */}
          {group.items && (
            <div className="showcase-img-grid">
              {group.items.map((item, ii) => (
                <ShowcaseImg key={ii} file={item.file} wide={item.wide} caption={item.caption} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

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

function PipelineViz({ pipeline }) {
  return (
    <div className="proj-pipeline">
      {pipeline.map((node, i) => (
        <div key={i} className="proj-pipeline-node">
          <div className="proj-pipeline-num">{node.num}</div>
          <div className="proj-pipeline-title">{node.title}</div>
          <div className="proj-pipeline-desc">{node.desc}</div>
        </div>
      ))}
    </div>
  );
}

// 工具 Tab 内容（构图校正 / 比例补边 / AI 音频工作台）
function ToolTabContent({ tab }) {
  return (
    <div className="tool-tab-content">
      {/* Tab 标签 + tagline */}
      <div className="tool-tab-header">
        <span className="proj-modal-tag">{tab.tag}</span>
        <p className="tool-tab-tagline">{tab.tagline}</p>
      </div>

      {/* 功能说明卡片 */}
      <InfoCards cards={tab.cards} />

      {/* 详情页面图片 */}
      {tab.showcase && tab.showcase.length > 0 && (
        <div className="tech-proj-showcase">
          <div className="proj-detail-section-head">
            <h4 className="proj-detail-h">详情页面</h4>
          </div>
          <div className="showcase-img-grid">
            {tab.showcase.map((item, i) => (
              <ShowcaseImg key={i} file={item.file} caption={item.caption} wide={item.wide} />
            ))}
          </div>
        </div>
      )}
      {tab.showcase && tab.showcase.length === 0 && (
        <div className="tool-tab-empty">截图待上传</div>
      )}
    </div>
  );
}

// 单个项目详情（弹窗内）
function ProjectDetail({ project }) {
  const { detail } = project;
  const [activeToolTab, setActiveToolTab] = useState(0);
  const hasTabs = detail.tabs && detail.tabs.length > 0;

  return (
    <div className="tech-proj-detail">
      <div className="tech-proj-detail-meta">
        <span><strong>职责</strong>{detail.role}</span>
      </div>
      <p className="tech-proj-overview">{detail.overview}</p>

      {/* 普通 sections（精细化、元素提取、Skill） */}
      {!hasTabs && detail.sections && detail.sections.map((sec, i) => (
        <div key={i} className="proj-detail-section">
          <div className="proj-detail-section-head">
            <h4 className="proj-detail-h">{sec.h}</h4>
            {sec.tag && <span className="proj-detail-tag">{sec.tag}</span>}
          </div>
          {sec.p && <p className="proj-detail-p">{sec.p}</p>}
          {sec.pipeline && <PipelineViz pipeline={sec.pipeline} />}
          {sec.cards && <InfoCards cards={sec.cards} />}
        </div>
      ))}

      {/* 工具 Tab 切换（tools 专属） */}
      {hasTabs && (
        <div className="tool-tabs-wrap">
          {/* 全宽分段式 Tab */}
          <div className="tool-tab-seg">
            {detail.tabs.map((tab, i) => (
              <button
                key={tab.id}
                className={`tool-tab-seg-btn${activeToolTab === i ? ' active' : ''}`}
                onClick={() => setActiveToolTab(i)}
              >
                <span className="tool-tab-seg-num">{String(i + 1).padStart(2, '0')}</span>
                {tab.label}
              </button>
            ))}
          </div>
          <ToolTabContent tab={detail.tabs[activeToolTab]} />
        </div>
      )}

      {/* 图片展示（非 tabs 项目）：自动判断分组 or 扁平，去掉"效果展示"标题 */}
      {!hasTabs && detail.showcase && detail.showcase.length > 0 && (
        <div className="tech-proj-showcase">
          {detail.showcase[0].group !== undefined ? (
            <ShowcaseGroups showcase={detail.showcase} />
          ) : (
            <div className="showcase-img-grid">
              {detail.showcase.map((item, i) => (
                <ShowcaseImg key={i} file={item.file} wide={item.wide} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 分类详情弹窗
function TechModal({ category, onClose }) {
  const [activeTab, setActiveTab] = useState(0);

  // 打开时锁定 body 滚动 + 隐藏 Nav，关闭时恢复
  useEffect(() => {
    if (category) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      const onEsc = (e) => e.key === 'Escape' && onClose();
      document.addEventListener('keydown', onEsc);
      return () => {
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', onEsc);
      };
    }
  }, [category, onClose]);

  if (!category) return null;

  const relatedProjects = category.projectIds
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="tech-modal">
      <div className="tech-modal-panel">
        <div className="tech-modal-head-row">
          <button className="tech-back-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="tech-cat-num">{category.num}</span>
        </div>
        <div className="tech-modal-header">
          <h2 className="tech-modal-title">{category.label}</h2>
          <p className="tech-modal-desc">{category.desc}</p>
          <div className="tech-cat-skills">
            {category.skills.map((s) => (
              <span key={s} className="proj-tech-chip liquid-glass">{s}</span>
            ))}
          </div>
        </div>

        {/* Tab 切换（多项目时）— 分段式，和工具 Tab 保持一致 */}
        {relatedProjects.length > 1 && (
          <div className="tool-tab-seg">
            {relatedProjects.map((p, i) => (
              <button
                key={p.id}
                className={`tool-tab-seg-btn${activeTab === i ? ' active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                <span className="tool-tab-seg-num">{String(i + 1).padStart(2, '0')}</span>
                {p.title}
              </button>
            ))}
          </div>
        )}

        {relatedProjects[activeTab] && (
          <>
            <div className="tech-modal-proj-title">
              <span className="proj-modal-tag">{relatedProjects[activeTab].tag}</span>
              <h3>{relatedProjects[activeTab].title}</h3>
              <p>{relatedProjects[activeTab].tagline}</p>
            </div>
            <ProjectDetail project={relatedProjects[activeTab]} />
          </>
        )}
      </div>
    </div>
  );
}

export default function Tech() {
  const ref = useReveal();
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <section className="section tech" id="tech" ref={ref}>
      <div className="tech-inner">
        <div className="tech-head">
          <div>
            <div className="tech-label reveal">Technical Artistry</div>
            <h2 className="tech-title reveal">技术美术</h2>
          </div>
          <p className="tech-desc reveal">
            从 AI 平台应用到自研工具开发，构建完整的技术能力闭环。
          </p>
        </div>

        <div className="tech-cats">
          {categories.map((cat, i) => {
            // 项目名列表：优先用 items，否则从 projects 取标题
            const projItems = cat.items ||
              cat.projectIds.map((id) => projects.find((p) => p.id === id)?.title).filter(Boolean);

            return (
              <div
                key={cat.id}
                className="tech-cat-card reveal liquid-glass"
                style={{ transitionDelay: `${i * 0.12}s` }}
                onClick={() => setActiveCategory(cat)}
              >
                {/* 顶部编号 + 英文 */}
                <div className="tech-cat-card-top">
                  <span className="tech-cat-num">{cat.num}</span>
                  <span className="tech-cat-en">{cat.en}</span>
                </div>

                {/* 中文标题 */}
                <h3 className="tech-cat-label">{cat.label}</h3>

                {/* 项目名——挪到标题下方，醒目展示 */}
                <div className="tech-cat-proj-showcase">
                  {projItems.map((name, idx) => (
                    <div key={idx} className="tech-cat-proj-row">
                      <span className="tech-cat-proj-idx">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="tech-cat-proj-name">{name}</span>
                    </div>
                  ))}
                </div>

                {/* 描述文字 */}
                <p className="tech-cat-desc">{cat.desc}</p>

                {/* 技能标签 */}
                <div className="tech-cat-skills">
                  {cat.skills.map((s) => (
                    <span key={s} className="tech-skill-tag">{s}</span>
                  ))}
                </div>

                {/* CTA */}
                <div className="tech-cat-cta">
                  查看项目详情
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TechModal
        category={activeCategory}
        onClose={() => setActiveCategory(null)}
      />
    </section>
  );
}
