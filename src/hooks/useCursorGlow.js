import { useEffect } from 'react';
import { GLOW, TIMING, BREAKPOINTS } from '../data/constants';

export function useCursorGlow() {
  useEffect(() => {
    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'fixed',
      width: `${GLOW.size}px`,
      height: `${GLOW.size}px`,
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '9998',
      background: `radial-gradient(circle, rgba(99,102,241,${GLOW.opacity}) 0%, transparent 70%)`,
      transform: 'translate(-50%,-50%)',
      opacity: '0',
      transition: `opacity ${TIMING.glareTransition}s ease`,
    });
    document.body.appendChild(el);

    let timeout;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;

    const move = (e) => {
      if (window.innerWidth > BREAKPOINTS.tablet && !isCoarse) {
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
        el.style.opacity = '1';
        clearTimeout(timeout);
        timeout = setTimeout(() => { el.style.opacity = '0'; }, TIMING.glowHide);
      }
    };

    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      el.remove();
    };
  }, []);
}
