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

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        aplicar(calc());
      });
    };

    let escuchando = false;
    const desconectar = () => {
      if (!escuchando) return;
      escuchando = false;
      window.removeEventListener('scroll', onScroll);
    };

    // el progreso solo sube: una vez revelada la seccion ya no hay nada que medir
    const aplicar = (p) => {
      maxRef.current = Math.max(maxRef.current, p);
      const v = Math.min(1, Math.round(maxRef.current * 100) / 100);
      setProgress(v);
      if (v >= 1) desconectar();
    };

    aplicar(calc());

    if (maxRef.current < 1) {
      escuchando = true;
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    return () => {
      desconectar();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [offset, endOffset]);

  return [ref, progress];
}
