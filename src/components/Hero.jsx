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
        <blockquote className={l('hero-quote reveal-left')}>
          <p>
            Nunca podré ser todas las personas que quiero ser ni vivir todas las vidas que quiero vivir. Jamás podré aprender a hacer todas las cosas que quiero aprender a hacer. Y ¿por qué quiero? Quiero vivir y sentir todas las tonalidades, matices y variaciones de la experiencia mental y física que sea posible.
          </p>
          <cite className={l('hero-quote-author reveal-right')}>Sylvia Plath</cite>
        </blockquote>
      </div>
      <div className={l('hero-scroll reveal-blur')}>
        <span>Desliza</span>
        <div className="line" />
      </div>
    </section>
  );
}
