import { useLayoutEffect, useRef } from 'react';
import '../styles/sectionEntrance.css';

export function useSectionEntrance() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const scope = ref.current;
    if (!scope || typeof IntersectionObserver === 'undefined') return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const targets = [...scope.querySelectorAll('[data-entrance]')];
    const reveal = target => {
      target.dataset.entranceState = 'visible';
      observer.unobserve(target);
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) reveal(entry.target);
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });

    targets.forEach(target => {
      // Restored pages must not replay entrances for content already passed.
      if (motion.matches || target.getBoundingClientRect().bottom <= 0) return;
      target.dataset.entranceState = 'pending';
      observer.observe(target);
    });
    const onFocus = event => {
      const target = event.target.closest('[data-entrance]');
      if (target && scope.contains(target)) reveal(target);
    };
    const onMotionChange = () => {
      if (motion.matches) targets.forEach(reveal);
    };
    scope.addEventListener('focusin', onFocus);
    motion.addEventListener('change', onMotionChange);
    return () => {
      observer.disconnect();
      scope.removeEventListener('focusin', onFocus);
      motion.removeEventListener('change', onMotionChange);
      targets.forEach(target => delete target.dataset.entranceState);
    };
  }, []);

  return ref;
}
