import { useRef, useState, useEffect } from 'react';

export function useScrollProgress({ offset = 120 } = {}) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setProgress(1);
      return;
    }

    // una sola actualizacion por seccion: antes esto recalculaba y re-renderizaba en cada cuadro del scroll
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProgress(1);
          observer.disconnect();
        }
      },
      { rootMargin: `0px 0px -${offset}px 0px`, threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [offset]);

  return [ref, progress];
}
