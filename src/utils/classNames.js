export function fadeUp(base, visible) {
  return `${base} fade-up${visible ? ' visible' : ''}`;
}

export function reveal(base, visible, type = 'up') {
  return `${base} reveal reveal-${type}${visible ? ' visible' : ''}`;
}

const TRANSITION = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

export function scrollRevealStyle(progress, type = 'up', retraso = 0) {
  const p = Math.max(0, Math.min(1, progress));
  const base = {
    opacity: `var(--reveal-opacity, ${p})`,
    transition: `var(--reveal-transition, ${TRANSITION})`,
    transitionDelay: `var(--reveal-delay, ${retraso}s)`,
  };
  const transform = (value) => `var(--reveal-transform, ${value})`;
  // ya revelado: sin transform ni will-change, la transicion se encarga de la entrada
  if (p >= 1) return base;
  switch (type) {
    case 'up':
      return { ...base, transform: transform(`translateY(${(1 - p) * 40}px)`) };
    case 'down':
      return { ...base, transform: transform(`translateY(${(1 - p) * -40}px)`) };
    case 'left':
      return { ...base, transform: transform(`translateX(${(1 - p) * -60}px)`) };
    case 'right':
      return { ...base, transform: transform(`translateX(${(1 - p) * 60}px)`) };
    case 'scale':
      return { ...base, transform: transform(`scale(${0.85 + 0.15 * p})`) };
    case 'rotate':
      return {
        ...base,
        transform: transform(`perspective(800px) rotateX(${(1 - p) * 10}deg) translateY(${(1 - p) * 30}px)`),
      };
    case 'blur':
      return {
        ...base,
        filter: `var(--reveal-filter, blur(${(1 - p) * 6}px))`,
        transform: transform(`translateY(${(1 - p) * 20}px)`),
      };
    default:
      return base;
  }
}
