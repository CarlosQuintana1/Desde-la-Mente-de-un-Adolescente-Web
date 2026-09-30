import { useLayoutEffect, useRef } from 'react';
import '../styles/sectionEntrance.css';

export function useSectionEntrance() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const scope = ref.current;
    if (!scope || typeof IntersectionObserver === 'undefined') return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const targets = [...scope.querySelectorAll('[data-entrance]')];
    let frame;
    const reveal = target => {
      target.dataset.entranceState = 'visible';
    };
    const observer = new IntersectionObserver(entries => {
      if (motion.matches) return;
      entries.forEach(entry => {
        if (entry.isIntersecting) reveal(entry.target);
      });
    }, { rootMargin: '0px 0px -72px 0px', threshold: 0 });
    // Reset beyond the viewport so small scroll reversals cannot interrupt an entrance.
    const exitObserver = new IntersectionObserver(entries => {
      if (motion.matches) return;
      entries.forEach(entry => {
        if (!entry.isIntersecting && !entry.target.contains(document.activeElement)) {
          entry.target.dataset.entranceState = 'pending';
        }
      });
    }, { rootMargin: '96px 0px', threshold: 0 });
    const initialize = () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      exitObserver.disconnect();
      targets.forEach(target => {
        if (motion.matches || target.contains(document.activeElement)) {
          reveal(target);
          return;
        }
        target.dataset.entranceState = 'pending';
      });
      if (motion.matches) return;
      // Paint the initial state before revealing content at a restored scroll position.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          targets.forEach(target => {
            observer.observe(target);
            exitObserver.observe(target);
          });
        });
      });
    };
    initialize();
    const onFocus = event => {
      const target = event.target.closest('[data-entrance]');
      if (target && scope.contains(target)) reveal(target);
    };
    const onPageShow = event => {
      if (event.persisted) initialize();
    };
    scope.addEventListener('focusin', onFocus);
    motion.addEventListener('change', initialize);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      exitObserver.disconnect();
      scope.removeEventListener('focusin', onFocus);
      motion.removeEventListener('change', initialize);
      window.removeEventListener('pageshow', onPageShow);
      targets.forEach(target => delete target.dataset.entranceState);
    };
  }, []);

  return ref;
}
