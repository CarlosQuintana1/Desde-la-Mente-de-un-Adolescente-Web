import { useRef, useState, useLayoutEffect } from 'react';

export function useScrollProgress({ offset = 120, endOffset = 0.1 } = {}) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(1);
  const maxRef = useRef(0);
  const rafRef = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const calc = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const elHeight = Math.max(rect.height, 1);

      const start = vh + offset;
      const end = vh * endOffset;
      const total = start - end;
      const dist = start - rect.top;
      const viewProgress = dist / total;

      const visibleHeight = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
      const interProgress = visibleHeight / elHeight;

      return Math.max(0, Math.min(1, Math.max(viewProgress, interProgress)));
    };

    const initial = calc();
    maxRef.current = initial;
    setProgress(initial);

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const p = calc();
        maxRef.current = Math.max(maxRef.current, p);
        setProgress(Math.min(1, maxRef.current));
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [offset, endOffset]);

  return [ref, progress];
}
