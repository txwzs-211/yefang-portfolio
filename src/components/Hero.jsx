import { useRef, useEffect, useState } from 'react';

const base = import.meta.env.BASE_URL;

export default function Hero({ onNavigate }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.preload = 'auto';
    const onCan = () => { setReady(true); v.play().catch(() => {}); };
    v.addEventListener('canplay', onCan, { once: true });
    v.load();
    return () => v.removeEventListener('canplay', onCan);
  }, []);

  return (
    <section className="section hero" id="hero">
      {/* 视频背景 */}
      <div className="hero-img-bg" aria-hidden="true">
        <video
          ref={videoRef}
          src={`${base}assets/hero-bg-video.mp4`}
          muted loop playsInline
          style={{ opacity: ready ? 1 : 0, transition: 'opacity 1s ease' }}
        />
      </div>
      {/* 左侧渐变遮罩 */}
      <div className="hero-overlay" />

      {/* 文字内容 */}
      <div className="hero-content">
        <div className="hero-eyebrow">YE FANG · AI TECHNICAL ARTIST</div>
        <h1 className="hero-title">
          叶芳
          <br />
          <em>Portfolio</em>
        </h1>
        <p className="hero-sub">
          AI技术美术 · 影视全链路创作 · AI工具产品化。<br />
          从创意到落地，让技术成为创作的翅膀。
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => onNavigate('works')}>
            查看作品
          </button>
          <button className="btn btn-glass liquid-glass" onClick={() => onNavigate('about')}>
            关于我
          </button>
        </div>
      </div>

      <div className="hero-scroll-hint">SCROLL ↓</div>
    </section>
  );
}
