import { useEffect, useRef, useState } from 'react';
import { SITE } from '../data/constants';
import './Hero.css';

export default function Hero() {
  const backgroundRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger entrance animation shortly after mount
    const timer = setTimeout(() => setLoaded(true), 100);
    let ticking = false;
    let visible = true;

    const handleScroll = () => {
      // fuera de pantalla el parallax no se ve: no hay por que seguir escribiendo transforms
      if (!visible || ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        const sy = window.scrollY;
        if (backgroundRef.current) {
          backgroundRef.current.style.transform = `translateY(${sy * 0.28}px) scale(${1 + sy * 0.00015})`;
        }
      });
    };

    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    if (backgroundRef.current) observer.observe(backgroundRef.current);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const l = (base) => `${base} reveal${loaded ? ' visible' : ''}`;

  return (
    <section className="hero" id="inicio">
      <div 
        className="hero-background" 
        ref={backgroundRef}
      />
      <div className="hero-content">
        <h1 className={l('reveal-left')}>
          Desde la<br />
          <span className="accent">Mente</span> de un<br />
          <span className="accent2">Adolescente</span>
        </h1>
        <p className={l('hero-sub reveal-right')}>
          Un espacio donde las ideas no tienen edad.
        </p>
        <div className={l('hero-actions reveal-up')}>
          <a
            href={SITE.spotify}
            target="_blank" rel="noopener noreferrer"
            className="btn-primary"
          >
            <span>
              <img 
                src="/assets/img/spotify.webp" 
                alt="" 
                className="btn-play-icon" 
                width={20} 
                height={20} 
                style={{ objectFit: 'contain' }}
              />
              Escuchar en Spotify
            </span>
          </a>
          <a href="#episodios" className="btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('episodios')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Ver Episodios
          </a>
        </div>
      </div>
      <div className={l('hero-scroll reveal-blur')}>
        <span>Desliza</span>
        <div className="line" />
      </div>
    </section>
  );
}
