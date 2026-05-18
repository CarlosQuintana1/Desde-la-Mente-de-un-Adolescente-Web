import { SITE } from '../data/constants';

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-content">
        <div className="hero-badge fade-up visible">
          <span className="dot" />
          Podcast · Temporada 1
        </div>
        <h1 className="fade-up visible stagger-1">
          Desde la<br />
          <span className="accent">Mente</span> de un<br />
          <span className="accent2">Adolescente</span>
        </h1>
        <p className="hero-sub fade-up visible stagger-2">
          Un espacio donde las ideas no tienen edad. Conversaciones con científicos,
          artistas y visionarios que están transformando el mundo desde la pasión
          y el conocimiento.
        </p>
        <div className="hero-actions fade-up visible stagger-3">
          <a
            href={SITE.spotify}
            target="_blank" rel="noopener noreferrer"
            className="btn-primary"
          >
            <span>▶ Escuchar en Spotify</span>
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
