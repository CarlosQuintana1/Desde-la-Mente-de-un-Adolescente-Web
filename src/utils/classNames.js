export function fadeUp(base, visible) {
  return `${base} fade-up${visible ? ' visible' : ''}`;
}

export function reveal(base, visible, type = 'up') {
  return `${base} reveal reveal-${type}${visible ? ' visible' : ''}`;
}

const TRANSITION = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

export function scrollRevealStyle(progress, type = 'up', retraso = 0) {
  const p = Math.max(0, Math.min(1, progress));
  const base = { transition: TRANSITION, transitionDelay: `${retraso}s` };
  // ya revelado: sin transform ni will-change, la transicion se encarga de la entrada
  if (p >= 1) return { ...base, opacity: 1 };
  switch (type) {
    case 'up':
      return { ...base, opacity: p, transform: `translateY(${(1 - p) * 40}px)` };
    case 'down':
      return { ...base, opacity: p, transform: `translateY(${(1 - p) * -40}px)` };
    case 'left':
      return { ...base, opacity: p, transform: `translateX(${(1 - p) * -60}px)` };
    case 'right':
      return { ...base, opacity: p, transform: `translateX(${(1 - p) * 60}px)` };
    case 'scale':
      return { ...base, opacity: p, transform: `scale(${0.85 + 0.15 * p})` };
    case 'rotate':
      return {
        ...base,
        opacity: p,
        transform: `perspective(800px) rotateX(${(1 - p) * 10}deg) translateY(${(1 - p) * 30}px)`,
      };
    case 'blur':
      return {
        ...base,
        opacity: p,
        filter: `blur(${(1 - p) * 6}px)`,
        transform: `translateY(${(1 - p) * 20}px)`,
      };
    default:
      return { ...base, opacity: p };
  }
}
