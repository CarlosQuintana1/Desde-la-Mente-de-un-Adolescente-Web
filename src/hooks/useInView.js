import { useRef, useState, useEffect } from 'react';
import { SCROLL } from '../data/constants';

export function useInView(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: `0px 0px ${SCROLL.rootMargin} 0px`, threshold: 0.1, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  // fire once on mount using defaults — options are stable by design
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, visible];
}
