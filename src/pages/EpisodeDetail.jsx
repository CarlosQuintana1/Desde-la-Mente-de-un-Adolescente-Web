import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { episodes } from '../data/episodes';
import SEO from '../components/SEO';
import ScienceIcon from '../components/icons/ScienceIcon';
import TechIcon from '../components/icons/TechIcon';
import ArtIcon from '../components/icons/ArtIcon';
import '../components/Episodes.css';

const CATEGORY_CONFIG = {
  Ciencia: { className: 'episodio-category episodio-category-ciencia', icon: <ScienceIcon /> },
  Tecnologia: { className: 'episodio-category episodio-category-tecnologia', icon: <TechIcon /> },
  Arte: { className: 'episodio-category episodio-category-arte', icon: <ArtIcon /> },
};

const renderCategoryBadge = (category) => {
  let config = { className: "episodio-category", icon: null };
  
  if (category.startsWith('Ciencia')) {
    config = CATEGORY_CONFIG.Ciencia;
  } else if (category.startsWith('Tecnología')) {
    config = CATEGORY_CONFIG.Tecnologia;
  } else if (category.startsWith('Arte')) {
    config = CATEGORY_CONFIG.Arte;
  }

  return (
    <span className={config.className}>
      {config.icon}
      {category}
    </span>
  );
};

const cleanTitle = (title) => {
  return title.replace(/Dedicar tu vida a( la | los |l )/i, '');
};

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function formatoFecha(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

function getSpotifyEpisodeId(url) {
  try {
    const segments = new URL(url).pathname.split('/').filter(Boolean);
    const episodeIndex = segments.indexOf('episode');
    return episodeIndex >= 0 ? segments[episodeIndex + 1] : null;
  } catch {
    return null;
  }
}

function SpotifyEmbed({ spotifyUrl, episodeTitle }) {
  const [isOpen, setIsOpen] = useState(false);
  const episodeId = getSpotifyEpisodeId(spotifyUrl);

  if (!episodeId) return null;

  const embedId = `spotify-embed-${episodeId}`;

  return (
    <div className="spotify-embed">
      <button
        type="button"
        className="spotify-embed-control"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? embedId : undefined}
      >
        <img src="/assets/img/spotify.webp" alt="" width="18" height="18" aria-hidden="true" />
        {isOpen ? 'Ocultar reproductor' : 'Escuchar en la página'}
      </button>
      {isOpen && (
        <div className="spotify-embed-panel" id={embedId}>
          <iframe
            src={`https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator&theme=0`}
            title={`Reproductor de Spotify: ${episodeTitle}`}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        </div>
      )}
    </div>
  );
}

export default function EpisodeDetail() {
  const { id } = useParams();
  
  // Find the episode matching the number (id in URL)
  const ep = episodes.find((e) => e.number === id || e.number === id?.padStart(2, '0'));

  if (!ep) {
    return (
      <div>
        <SEO title="Episodio no encontrado" />
        <div className="page-hero fade-up visible page-hero--inner" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
          <h1>Episodio <span className="accent">no encontrado</span></h1>
          <p style={{ margin: '1.5rem auto' }}>Lo sentimos, el episodio que buscas no existe o ha sido movido.</p>
          <Link to="/episodios" className="btn-secondary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
            Ver todos los episodios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEO 
        title={`Ep. ${ep.number}: ${ep.name}`} 
        description={`${ep.title} con ${ep.name}. ${ep.desc}`}
        image={ep.img}
        url={`/episodio/${ep.number}`}
        type="video.episode"
      />

      <div className="page-hero fade-up visible page-hero--inner" style={{ paddingTop: '2rem' }}>
        <div className="episode-nav">
          <Link to="/" state={{ scrollTo: 'episodios' }} viewTransition className="back-link">← Inicio</Link>
          <Link to="/episodios" viewTransition className="back-link">Todos los episodios →</Link>
        </div>
        <h1>Detalle del <span className="accent">Episodio</span></h1>
        <p style={{ maxWidth: 'none' }}>Conoce más a fondo sobre la trayectoria y pasiones de nuestro invitado.</p>
      </div>

      <section className="episodios" style={{ paddingTop: '1rem', paddingBottom: '8rem' }}>
        <div className="ultimo-episodio-card" style={{ cursor: 'default' }}>
          <div className="ultimo-img-wrap">
            <span className="episodio-number">EP {ep.number}</span>
            <img
              src={ep.img}
              alt={ep.alt}
              width={400}
              height={400}
              loading="eager"
              style={{ viewTransitionName: `episode-cover-${ep.number}` }}
            />
          </div>
          <div className="ultimo-info">
            <div>
              {renderCategoryBadge(ep.category)}
            </div>
            <h2
              className="ultimo-titulo"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', margin: '1rem 0', viewTransitionName: `episode-title-${ep.number}` }}
            >
              Ep #{ep.number}: {cleanTitle(ep.title)} con <span className="ultimo-invitado">{ep.name}</span>
            </h2>
            {(ep.fecha || ep.duracion) && (
              <p className="episodio-meta">
                {ep.fecha && <time dateTime={ep.fecha}>{formatoFecha(ep.fecha)}</time>}
                {ep.fecha && ep.duracion && ' · '}
                {ep.duracion && `${ep.duracion} min`}
              </p>
            )}
            <p className="ultimo-desc" style={{ fontSize: '1.05rem', marginBottom: '1.5rem' }}>{ep.desc}</p>
            {ep.quote && <p className="ultimo-cita">{ep.quote}</p>}
            
            <div className="ultimo-actions">
              <a href={ep.links.spotify} target="_blank" rel="noopener noreferrer" className="btn-primary btn-play">
                <span>
                  <img 
                    src="/assets/img/spotify.webp" 
                    alt="" 
                    width={18} 
                    height={18} 
                    style={{ objectFit: 'contain', verticalAlign: 'middle' }} 
                  />
                  Reproducir ahora
                </span>
              </a>
              <div className="episodio-links">
                <a href={ep.links.instagram} target="_blank" rel="noopener noreferrer">
                  <img src="/assets/img/instagram.webp" alt="" width={18} height={18} />
                  <span>Instagram</span>
                </a>
                <a href={ep.links.apple} target="_blank" rel="noopener noreferrer">
                  <img src="/assets/img/applepodcast.webp" alt="" width={18} height={18} />
                  <span>Apple Podcasts</span>
                </a>
              </div>
            </div>
            <SpotifyEmbed spotifyUrl={ep.links.spotify} episodeTitle={`Ep. ${ep.number}: ${ep.name}`} />
          </div>
        </div>

        {ep.notas && (
          <details className="episodio-notas">
            <summary>Sobre este episodio</summary>
            <div className="episodio-notas-cuerpo">
              {ep.notas.split('\n').map((linea, i) => <p key={i}>{linea}</p>)}
            </div>
          </details>
        )}
      </section>
    </div>
  );
}
