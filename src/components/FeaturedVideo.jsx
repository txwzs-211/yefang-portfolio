import { useVideoLazyLoad } from '../hooks/useVideoLazyLoad';
import { useReveal } from '../hooks/useReveal';

export default function FeaturedVideo({ onNavigate }) {
  const ref = useReveal();
  const { videoRef, isLoaded } = useVideoLazyLoad({ rootMargin: '300px' });
  const base = import.meta.env.BASE_URL;

  return (
    <section className="section featured" id="featured" ref={ref}>
      <div className="featured-inner">
        <div className="featured-video-wrap reveal">
          <video
            ref={videoRef}
            src={`${base}assets/chengdu.mp4`}
            muted
            loop
            playsInline
            style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
          />
          <div className="featured-overlay" />
          <div className="featured-content">
            <div className="featured-card liquid-glass">
              <div className="featured-card-label">Featured Work</div>
              <div className="featured-card-text">
                成都城市宣传片 — 用AI重新诠释城市影像，探索AI技术在城市品牌传播中的可能性。
              </div>
            </div>
            <button className="btn btn-glass liquid-glass" onClick={() => onNavigate('works')}>
              Explore more
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
