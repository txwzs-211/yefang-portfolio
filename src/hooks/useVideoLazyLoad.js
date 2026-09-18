import { useEffect, useRef, useState } from 'react';

/**
 * 视频懒加载 Hook
 * 视频进入视口前只加载 metadata，进入视口后才开始加载视频数据并播放
 */
export function useVideoLazyLoad(options = {}) {
  const { rootMargin = '200px', threshold = 0.1 } = options;
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 初始只加载元数据
    video.preload = 'metadata';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    // 进入视口后开始加载完整视频
    video.preload = 'auto';
    video.load();

    const handleCanPlay = () => {
      setIsLoaded(true);
      video.play().catch(() => {});
    };

    video.addEventListener('canplay', handleCanPlay, { once: true });
    return () => video.removeEventListener('canplay', handleCanPlay);
  }, [shouldLoad]);

  return { videoRef, shouldLoad, isLoaded };
}
