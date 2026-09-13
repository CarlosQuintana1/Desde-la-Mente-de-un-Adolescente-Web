import { useEffect, useRef, useState } from 'react';
import './Hero.css';

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

    const update = () => {
      frame = 0;
      if (!active) return;

      const rect = hero.getBoundingClientRect();
      const travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-rect.top / travel);

      if (reducedMotion.matches) {
        const finalFrame = progress >= 0.5;
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
              Nunca podré ser todas las personas que quiero ser ni vivir todas las vidas que quiero vivir.
            </p>
            <p>
              Jamás podré aprender a hacer todas las cosas que quiero aprender a hacer.
            </p>
            <p>Y ¿por qué quiero?</p>
            <p>
              Quiero vivir y sentir todas las tonalidades, matices y variaciones de la experiencia mental y física que sea posible.
            </p>
            <cite className="hero-quote-author">Sylvia Plath</cite>
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

        <div className="hero-scroll">
          <span>Desliza</span>
          <div className="line" />
        </div>
      </div>
    </section>
  );
}
