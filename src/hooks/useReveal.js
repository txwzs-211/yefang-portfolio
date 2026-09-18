import { useEffect, useRef } from 'react';

export function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '-100px' }
    );

    const el = ref.current;
    if (el) {
      // 观察当前元素及其所有子元素中的 reveal 类
      observer.observe(el);
      el.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((child) => {
        observer.observe(child);
      });
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}
