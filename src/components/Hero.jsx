import { useEffect, useRef } from 'react';
import { SITE } from '../data/constants';
import './Hero.css';

export default function Hero() {
  const backgroundRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sy = window.scrollY;
          if (backgroundRef.current) {
            backgroundRef.current.style.transform = `translateY(${sy * 0.28}px) scale(${1 + sy * 0.00015})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero" id="inicio">
      <div 
        className="hero-background" 
        ref={backgroundRef}
      />
      <div className="hero-content">
        <div className="hero-badge">
          <span className="dot" />
          Podcast · Temporada 1
        </div>
        <h1>
          Desde la<br />
          <span className="accent">Mente</span> de un<br />
          <span className="accent2">Adolescente</span>
        </h1>
        <p className="hero-sub">
          Un espacio donde las ideas no tienen edad. Conversaciones con científicos,
          artistas y visionarios que están transformando el mundo desde la pasión
          y el conocimiento.
        </p>
        <div className="hero-actions">
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
      <div className="hero-scroll">
        <span>Desliza</span>
        <div className="line" />
      </div>
    </section>
  );
}
