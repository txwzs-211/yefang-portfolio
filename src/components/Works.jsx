import { useRef, useEffect, useState, useCallback } from 'react';
import { works } from '../data/works';
import { useReveal } from '../hooks/useReveal';

const base = import.meta.env.BASE_URL;

// 占位标记判断（包含「流程一」～「流程十」等编号占位）
const PLACEHOLDER_EXACT = new Set([
  '待补充', '——', '项目介绍待补充。', '创作笔记待补充。',
  '流程一','流程二','流程三','流程四','流程五',
  '流程六','流程七','流程八','流程九','流程十',
]);
const isPlaceholder = (v) => {
  if (!v) return true;
  const t = v.trim();
  return PLACEHOLDER_EXACT.has(t) || t === '';
};

// ─── 图片展示（含错误回退）────────────────────────────────
function AssetImg({ file, label, wide }) {
  const [err, setErr] = useState(false);
  return (
    <div className={`asset-img-wrap${wide ? ' asset-img-wrap--wide' : ''}`}>
      {!err ? (
        <img
          src={`${base}assets/${file}`}
          alt={label}
          onError={() => setErr(true)}
          className="asset-img"
        />
      ) : (
        <div className="asset-img-slot">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span>{label}</span>
          <span className="asset-img-file">{file}</span>
        </div>
      )}
      <div className="asset-img-caption">{label}</div>
    </div>
  );
}

// ─── 自定义视频控制条（含音量+全屏）────────────────────────
function VideoControls({ videoRef, isPlaying, setIsPlaying }) {
  const [progress,  setProgress]  = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration,  setDuration]  = useState('0:00');
  const [muted,     setMuted]     = useState(false);
  const barRef = useRef(null);

  const fmt = (s) => {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
      setCurrentTime(fmt(v.currentTime));
    };
    const onMeta = () => setDuration(fmt(v.duration));
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    if (v.readyState >= 1) setDuration(fmt(v.duration));
    return () => { v.removeEventListener('timeupdate', onTime); v.removeEventListener('loadedmetadata', onMeta); };
  }, [videoRef]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setIsPlaying(true); }
    else { v.pause(); setIsPlaying(false); }
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
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      (v.requestFullscreen || v.webkitRequestFullscreen || v.mozRequestFullScreen)?.call(v);
    }
  };

  const seek = useCallback((e) => {
    const v = videoRef.current;
    const bar = barRef.current;
    if (!v || !bar) return;
    const rect = bar.getBoundingClientRect();
    v.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * v.duration;
  }, [videoRef]);

  return (
    <div className="vc-bar">
      {/* 播放/暂停 */}
      <button className="vc-btn" onClick={togglePlay} aria-label={isPlaying ? '暂停' : '播放'}>
        {isPlaying
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
        }
      </button>
      {/* 进度条 */}
      <div ref={barRef} className="vc-track" onClick={seek}>
        <div className="vc-fill" style={{ width: `${progress}%` }} />
        <div className="vc-thumb" style={{ left: `${progress}%` }} />
      </div>
      {/* 时间 */}
      <div className="vc-time">{currentTime} / {duration}</div>
      {/* 音量 */}
      <button className="vc-btn" onClick={toggleMute} aria-label={muted ? '取消静音' : '静音'}>
        {muted
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/></svg>
        }
      </button>
      {/* 全屏 */}
      <button className="vc-btn" onClick={toggleFullscreen} aria-label="全屏">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M21 16v3a2 2 0 01-2 2h-3M3 16v3a2 2 0 002 2h3"/>
        </svg>
      </button>
    </div>
  );
}

// ─── 重点视频：左右布局 ───────────────────────────────────
function FeaturedVideoBlock({ work }) {
  const videoRef  = useRef(null);
  const leftRef   = useRef(null);
  const rightRef  = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const d = work.detail;

  // 同步右侧高度 = 左侧实际高度
  const syncHeight = useCallback(() => {
    const l = leftRef.current;
    const r = rightRef.current;
    if (l && r) r.style.height = l.offsetHeight + 'px';
  }, []);

  // 加载 metadata + 触发高度同步
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.preload = 'metadata';
    const onMeta = () => { setLoaded(true); setTimeout(syncHeight, 50); };
    v.addEventListener('loadedmetadata', onMeta);
    v.load();
    return () => v.removeEventListener('loadedmetadata', onMeta);
  }, [syncHeight]);

  // ResizeObserver 监听左侧尺寸变化
  useEffect(() => {
    const l = leftRef.current;
    if (!l) return;
    const ro = new ResizeObserver(syncHeight);
    ro.observe(l);
    return () => ro.disconnect();
  }, [syncHeight]);

  const handleVideoClick = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    if (v.paused) { v.play().catch(() => {}); setIsPlaying(true); }
    else { v.pause(); setIsPlaying(false); }
  };

  const handleMouseEnter = () => {
    const v = videoRef.current;
    if (!v || !loaded) return;
    v.muted = true;
    v.play().then(() => setIsPlaying(true)).catch(() => {});
  };
  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setIsPlaying(false);
  };

  const hasRealFlow = d.flow && d.flow.some(s => !isPlaceholder(s.title));

  return (
    <div className="fv-block reveal">
      <div className="fv-inner">
        {/* 左：视频 + 控制条 */}
        <div className="fv-left" ref={leftRef}>
          <div className="fv-video-wrap" onClick={handleVideoClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <video
              ref={videoRef}
              src={`${base}${work.video}`}
              playsInline loop
              style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s', cursor: 'pointer' }}
            />
            {!isPlaying && loaded && (
              <div className="fv-play-hint">
                <div className="fv-play-btn">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          <VideoControls videoRef={videoRef} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
        </div>

        {/* 右：高度由 JS 精确锁定，内部滚动 */}
        <div className="fv-right" ref={rightRef}>
          <div className="fv-detail-scroll">
            <div className="fv-detail-header">
              {!isPlaceholder(work.tag) && (
                <span className="fv-detail-tag">{work.tag}</span>
              )}
              <h3 className="fv-detail-title">{work.title}</h3>
              {!isPlaceholder(work.meta) && (
                <p className="fv-detail-meta-row">{work.meta}</p>
              )}
              {!isPlaceholder(d.role) && (
                <p className="fv-detail-role">{d.role}</p>
              )}
              {!isPlaceholder(d.overview) && (
                <p className="fv-detail-overview">{d.overview}</p>
              )}
            </div>

            {hasRealFlow && (
              <div className="fv-detail-section">
                <div className="fv-section-label">制作流程</div>
                <div className="fv-flow-list">
                  {d.flow.filter(s => !isPlaceholder(s.title)).map((step, i) => (
                    <div key={i} className="fv-flow-item">
                      <span className="fv-flow-num">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <div className="fv-flow-title">{step.title}</div>
                        {!isPlaceholder(step.desc) && (
                          <div className="fv-flow-desc">{step.desc}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {d.assets && d.assets.length > 0 && (
              <div className="fv-detail-section">
                <div className="fv-section-label">资产图 · 效果展示</div>
                <div className="fv-asset-grid">
                  {d.assets.map((a, i) => (
                    <AssetImg key={i} file={a.file} label={a.label} wide={a.wide} />
                  ))}
                </div>
              </div>
            )}

            {!isPlaceholder(d.note) && (
              <div className="fv-detail-section">
                <div className="fv-section-label">创作笔记</div>
                <p className="fv-note">{d.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 小视频卡片 ───────────────────────────────────────────
function SmallWorkCard({ work, index, onOpenModal }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPortrait = !!work.portrait;

  useEffect(() => {
    if (!work.video) return;
    const observer = new IntersectionObserver(
      (e) => { if (e[0].isIntersecting) { setShouldLoad(true); observer.disconnect(); } },
      { rootMargin: '300px' }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [work.video]);

  const handleEnter = () => {
    if (videoRef.current && shouldLoad) videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };
  const handleLeave = () => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; setIsPlaying(false); }
  };

  return (
    <div className="small-work-wrapper reveal" style={{ transitionDelay: `${(index % 4) * 0.07}s` }}>
      <div
        ref={cardRef}
        className={`small-work-card${isPortrait ? ' small-work-card--portrait' : ''}`}
        onClick={() => onOpenModal(work.id)}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {work.video && shouldLoad ? (
          <video
            ref={videoRef}
            src={`${base}${work.video}`}
            muted loop playsInline preload="metadata"
            className="work-card-media"
            style={{ opacity: isPlaying ? 1 : 0.8, transition: 'opacity 0.3s' }}
          />
        ) : (
          <div className="work-cover"><span>{work.title}</span></div>
        )}
      </div>
      {/* 名称常驻卡片下方，显示完整名称+标签 */}
      <div className="small-work-name">
        {work.title}{!isPlaceholder(work.tag) ? <span className="small-work-tag-inline"> · {work.tag}</span> : ''}
      </div>
    </div>
  );
}

// ─── Works 主组件 ─────────────────────────────────────────
export default function Works({ onOpenModal }) {
  const ref = useReveal();
  const featured = works.filter((w) => w.featured);
  const small = works.filter((w) => !w.featured);

  return (
    <section className="section works" id="works" ref={ref}>
      <div className="works-inner">
        <div className="works-head">
          <div>
            <div className="works-label reveal">Selected Works</div>
            <h2 className="works-title reveal">视频作品</h2>
          </div>
          <p className="works-desc reveal">
            AI视频 · 游戏PV · 宣传片 · 短剧 — 每个项目都是技术与创意的碰撞。
          </p>
        </div>

        {/* 重点视频 */}
        <div className="fv-list">
          {featured.map((w) => (
            <FeaturedVideoBlock key={w.id} work={w} />
          ))}
        </div>

        {/* 分隔线 */}
        <div className="fw-divider">
          <div className="fw-divider-line" />
          <span className="fw-divider-label">更多作品</span>
          <div className="fw-divider-line" />
        </div>

        {/* 小视频网格 */}
        <div className="small-works-grid">
          {small.map((w, i) => (
            <SmallWorkCard key={w.id} work={w} index={i} onOpenModal={onOpenModal} />
          ))}
        </div>
      </div>
    </section>
  );
}
