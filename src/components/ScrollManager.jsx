import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const positions = new Map();

function readPosition(key) {
  if (positions.has(key)) return positions.get(key);
  try {
    return JSON.parse(sessionStorage.getItem(`dm_scroll:${key}`));
  } catch {
    return null;
  }
}

function savePosition(key, position) {
  positions.set(key, position);
  try {
    sessionStorage.setItem(`dm_scroll:${key}`, JSON.stringify(position));
  } catch {
    // Memory still restores navigation when browser storage is unavailable.
  }
}

function snapshot() {
  return {
    y: window.scrollY,
    tracks: Object.fromEntries([...document.querySelectorAll('[data-scroll-key]')]
      .map((el) => [el.dataset.scrollKey, el.scrollLeft])),
  };
}

export default function ScrollManager({ lenis }) {
  const { key, pathname, hash, state } = useLocation();
  const navigationType = useNavigationType();
  const lenisRef = useRef(lenis);

  useLayoutEffect(() => { lenisRef.current = lenis; }, [lenis]);

  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual';
    const entryKey = `${pathname}${hash}:${key}`;
    const saved = (navigationType === 'POP' && readPosition(entryKey))
      || (state?.restoreScroll && readPosition(`path:${pathname}`));
    const anchor = hash ? decodeURIComponent(hash.slice(1)) : state?.scrollTo;
    let lastPosition = saved || { y: 0, tracks: {} };
    let restoring = true;
    let timer;
    let readyAt;
    const startedAt = performance.now();

    const isReady = () => [...document.querySelectorAll('[data-scroll-page]')]
      .some((el) => el.dataset.scrollPage === pathname);
    const remember = () => {
      savePosition(entryKey, lastPosition);
      savePosition(`path:${pathname}`, lastPosition);
    };
    const track = () => {
      if (!restoring && isReady()) lastPosition = snapshot();
    };
    const beforeLeave = () => {
      if (isReady()) lastPosition = snapshot();
      remember();
    };
    const stop = () => {
      restoring = false;
      clearTimeout(timer);
      track();
    };

    // Wait for lazy routes and the hero's measured height before restoring.
    const restore = () => {
      if (!restoring) return;
      const now = performance.now();
      if (isReady()) {
        readyAt ??= now;
        const el = anchor && document.getElementById(anchor);
        const target = saved ? saved.y : el ? window.scrollY + el.getBoundingClientRect().top : 0;
        document.querySelectorAll('[data-scroll-key]').forEach((trackEl) => {
          const left = saved?.tracks?.[trackEl.dataset.scrollKey] || 0;
          if (Math.abs(trackEl.scrollLeft - left) > 1) trackEl.scrollTo({ left, behavior: 'instant' });
        });
        if (Math.abs(window.scrollY - target) > 1) {
          const scroller = lenisRef.current;
          if (scroller) {
            scroller.resize();
            scroller.scrollTo(target, { immediate: true, force: true });
          } else {
            window.scrollTo({ top: target, behavior: 'instant' });
          }
        }
        lastPosition = snapshot();
      }
      if (now - startedAt < 10000 && (readyAt === undefined || now - readyAt < 2000)) {
        timer = setTimeout(restore, 50);
      } else {
        stop();
      }
    };

    const userEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
    userEvents.forEach((event) => window.addEventListener(event, stop, { passive: true }));
    document.addEventListener('scroll', track, { capture: true, passive: true });
    document.addEventListener('click', beforeLeave, true);
    window.addEventListener('pagehide', beforeLeave);
    restore();

    return () => {
      clearTimeout(timer);
      remember();
      userEvents.forEach((event) => window.removeEventListener(event, stop));
      document.removeEventListener('scroll', track, true);
      document.removeEventListener('click', beforeLeave, true);
      window.removeEventListener('pagehide', beforeLeave);
    };
  }, [key, pathname, hash, state, navigationType]);

  return null;
}
