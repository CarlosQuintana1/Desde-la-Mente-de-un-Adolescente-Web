import { useParams, Link } from 'react-router-dom';
import { episodes } from '../data/episodes';
import SEO from '../components/SEO';
import ScienceIcon from '../components/icons/ScienceIcon';
import TechIcon from '../components/icons/TechIcon';
import ArtIcon from '../components/icons/ArtIcon';
import PlayIcon from '../components/icons/PlayIcon';
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

      <div className="page-hero fade-up visible page-hero--inner">
        <Link to="/episodios" className="back-link">← Todos los episodios</Link>
        <h1>Detalle del <span className="accent">Episodio</span></h1>
        <p>Conoce más a fondo sobre la trayectoria y pasiones de nuestro invitado especial.</p>
      </div>

      <section className="episodios" style={{ paddingTop: '1rem', paddingBottom: '8rem' }}>
        <div className="ultimo-episodio-card" style={{ cursor: 'default' }}>
          <div className="ultimo-img-wrap">
            <span className="episodio-number">EP {ep.number}</span>
            <img src={ep.img} alt={ep.alt} width={400} height={400} loading="eager" />
          </div>
          <div className="ultimo-info">
            {renderCategoryBadge(ep.category)}
            <h2 className="ultimo-titulo" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', margin: '1rem 0' }}>
              Ep #{ep.number}: {cleanTitle(ep.title)} con <span className="highlight">{ep.name}</span>
            </h2>
            <p className="ultimo-desc" style={{ fontSize: '1.05rem', marginBottom: '1.5rem' }}>{ep.desc}</p>
            {ep.quote && <p className="ultimo-cita">{ep.quote}</p>}
            
            <div className="ultimo-actions">
              <a href={ep.links.spotify} target="_blank" rel="noopener noreferrer" className="btn-primary btn-play">
                <span>
                  <PlayIcon className="btn-play-icon" />
                  Escuchar en Spotify
                </span>
              </a>
              <div className="episodio-links">
                <a href={ep.links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <img src="/assets/img/instagram.webp" alt="Instagram" width={18} height={18} />
                </a>
                <a href={ep.links.spotify} target="_blank" rel="noopener noreferrer" aria-label="Spotify">
                  <img src="/assets/img/spotify.webp" alt="Spotify" width={18} height={18} />
                </a>
                <a href={ep.links.apple} target="_blank" rel="noopener noreferrer" aria-label="Apple Podcasts">
                  <img src="/assets/img/applepodcast.webp" alt="Apple Podcasts" width={18} height={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
