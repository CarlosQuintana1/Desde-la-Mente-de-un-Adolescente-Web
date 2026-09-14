import { useEffect, useRef, useState } from 'react';
import './Hero.css';
import MindTree, { disciplines } from './MindTree';

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

function smoothstep(start, end, value) {
  const progress = clamp((value - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
}

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let active = true;
    let frame = 0;
    const stage = hero.querySelector('.hero-stage');
    const title = hero.querySelector('.hero-title');
    let stageHeight = stage.clientHeight;
    let titleHeight = title.offsetHeight;

    const updateTree = (progress, dock, reduced = false) => {
      const set = (name, value) => hero.style.setProperty(name, value.toFixed(4));
      const compactHeight = stageHeight < 600 ? 72 : 104;
      const scale = Math.min(0.82, compactHeight / titleHeight);
      set('--title-scale', 1 - dock * (1 - scale));
      hero.style.setProperty('--title-dock-y', `${dock * (-stageHeight / 2 + 24 + titleHeight * scale / 2)}px`);
      set('--tree-opacity', smoothstep(0, 0.06, progress));
      set('--tree-wave', reduced ? 0 : smoothstep(0, 0.07, progress) * (1 - smoothstep(0.10, 0.23, progress)));
      set('--wave-width', 1 - smoothstep(0.1, 0.23, progress) * 0.65);
      set('--tree-roots', smoothstep(0.10, 0.23, progress));
      set('--tree-trunk', smoothstep(0.18, 0.34, progress));
      disciplines.forEach((_, index) => {
        const start = 0.29 + index * 0.15;
        const branch = smoothstep(start + 0.025, start + 0.18, progress);
        set(`--branch-${index}`, branch);
        set(`--label-${index}`, smoothstep(start, start + 0.045, progress));
        set(`--travel-${index}`, reduced ? 0 : 1 - smoothstep(start, start + 0.14, progress));
        set(`--pulse-${index}`, reduced ? 0 : Math.sin(branch * Math.PI) * 0.85);
      });
      set('--tree-complete', smoothstep(0.91, 0.99, progress));
    };

    const update = () => {
      frame = 0;
      if (!active) return;

      const rect = hero.getBoundingClientRect();
      const travel = Math.max(hero.offsetHeight - stageHeight, 1);
      const sequence = clamp(-rect.top / travel);
      const progress = clamp(sequence * 3.5);

      if (reducedMotion.matches) {
        const finalFrame = sequence >= 0.3;
        updateTree(finalFrame ? 1 : 0, finalFrame ? 1 : 0, true);
        hero.style.setProperty('--hero-scale', '1');
        hero.style.setProperty('--hero-quote-opacity', finalFrame ? '0' : '1');
        hero.style.setProperty('--hero-quote-y', '0px');
        hero.style.setProperty('--hero-solid-opacity', finalFrame ? '1' : '0');
        hero.style.setProperty('--hero-title-1', finalFrame ? '1' : '0');
        hero.style.setProperty('--hero-title-2', finalFrame ? '1' : '0');
        hero.style.setProperty('--hero-title-3', finalFrame ? '1' : '0');
        hero.style.setProperty('--hero-title-y', '0px');
        hero.style.setProperty('--hero-scroll-opacity', progress > 0 ? '0' : '1');
        return;
      }

      const zoom = smoothstep(0.02, 0.64, progress);
      const quoteExit = smoothstep(0.06, 0.25, progress);
      const solid = smoothstep(0.24, 0.62, progress);
      const title1 = smoothstep(0.56, 0.68, progress);
      const title2 = smoothstep(0.6, 0.72, progress);
      const title3 = smoothstep(0.64, 0.76, progress);
      updateTree(clamp((sequence - 0.34) / 0.60), smoothstep(0.26, 0.38, sequence));

      hero.style.setProperty('--hero-scale', (1 + zoom * 0.95).toFixed(3));
      hero.style.setProperty('--hero-quote-opacity', (1 - quoteExit).toFixed(3));
      hero.style.setProperty('--hero-quote-y', `${(-20 * quoteExit).toFixed(1)}px`);
      hero.style.setProperty('--hero-solid-opacity', solid.toFixed(3));
      hero.style.setProperty('--hero-title-1', title1.toFixed(3));
      hero.style.setProperty('--hero-title-2', title2.toFixed(3));
      hero.style.setProperty('--hero-title-3', title3.toFixed(3));
      hero.style.setProperty('--hero-title-y', `${(28 * (1 - title2)).toFixed(1)}px`);
      hero.style.setProperty('--hero-scroll-opacity', (1 - smoothstep(0, 0.14, progress)).toFixed(3));
    };

    const requestUpdate = () => {
      if (!active || frame) return;
      frame = requestAnimationFrame(update);
    };
    const measure = () => {
      stageHeight = stage.clientHeight;
      titleHeight = title.offsetHeight;
      const tree = hero.querySelector('.mind-tree-art');
      const treeTop = parseFloat(getComputedStyle(tree.parentElement).top);
      const overlap = window.innerWidth <= 768 ? Math.max(0, stageHeight - treeTop - tree.offsetHeight - 40) : 0;
      hero.style.setProperty('--hero-overlap', `${overlap}px`);
      requestUpdate();
    };
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(stage);
    resizeObserver.observe(title);

    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      hero.classList.toggle('is-scroll-active', active && !reducedMotion.matches);
      if (active) requestUpdate();
    });

    observer.observe(hero);
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    reducedMotion.addEventListener('change', requestUpdate);
    update();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      reducedMotion.removeEventListener('change', requestUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={heroRef} className={`hero${loaded ? ' is-loaded' : ''}`} id="inicio">
      <div className="hero-stage">
        <picture className="hero-background">
          <source
            media="(max-width: 768px)"
            srcSet="/assets/img/hero-planeta-movil.webp 1x, /assets/img/hero-planeta-movil-hd.webp 2x"
          />
          <img
            src="/assets/img/hero-planeta-arbol.webp"
            srcSet="/assets/img/hero-planeta-arbol.webp 1x, /assets/img/hero-planeta-arbol-hd.webp 2x"
            alt=""
            aria-hidden="true"
            width="1672"
            height="941"
            fetchPriority="high"
          />
        </picture>

        <div className="hero-content">
          <blockquote className="hero-quote">
            <p>
              Cierren sus bibliotecas si quieren, pero no hay puerta, cerradura ni cerrojo que puedan poner a la libertad de mi mente.
            </p>
            <cite className="hero-quote-author">Virginia Woolf</cite>
          </blockquote>
        </div>

        <div className="hero-solid" aria-hidden="true" />
        <div className="hero-title-frame">
          <h1 className="hero-title">
            <span>Desde la</span>
            <span>mente de un</span>
            <span>Adolescente</span>
          </h1>
        </div>

        <MindTree />

        <div className="hero-scroll">
          <span>Desliza</span>
          <div className="line" />
        </div>
      </div>
    </section>
  );
}
