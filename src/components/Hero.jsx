import { useEffect, useState } from 'react';
import './Hero.css';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger entrance animation shortly after mount
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const l = (base) => `${base} reveal${loaded ? ' visible' : ''}`;

  return (
    <section className="hero" id="inicio">
      <picture className="hero-background">
        <source media="(max-width: 768px)" srcSet="/assets/img/hero-planeta-movil.webp" />
        <img
          src="/assets/img/hero-planeta-arbol.webp"
          alt=""
          aria-hidden="true"
          width="1672"
          height="941"
          fetchPriority="high"
        />
      </picture>
      <div className="hero-content">
        <h1 className={l('reveal-left')}>
          Desde la<br />
          <span className="accent">Mente</span> de un<br />
          <span className="accent2">Adolescente</span>
        </h1>
        <p className={l('hero-sub reveal-right')}>
          Un espacio donde las ideas no tienen edad.
        </p>
      </div>
      <div className={l('hero-scroll reveal-blur')}>
        <span>Desliza</span>
        <div className="line" />
      </div>
    </section>
  );
}
