import { useParams, useLocation, Link } from 'react-router-dom';
import { episodes } from '../data/episodes';
import SEO from '../components/SEO';
import EpisodeActions from '../components/EpisodeActions';
import EpisodeDescription from '../components/EpisodeDescription';
import '../components/Episodes.css';

const cleanTitle = (title) => {
  return title.replace(/Dedicar tu vida a( la | los |l )/i, '');
};

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function formatoFecha(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

export default function EpisodeDetail() {
  const { id } = useParams();
  const { pathname } = useLocation();
  
  // Find the episode matching the number (id in URL)
  const ep = episodes.find((e) => e.number === id || e.number === id?.padStart(2, '0'));

  if (!ep) {
    return (
      <div data-scroll-page={pathname}>
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
    <div data-scroll-page={pathname}>
      <SEO 
        title={`Ep. ${ep.number}: ${ep.name}`} 
        description={`${ep.title} con ${ep.name}. ${ep.desc}`}
        image={ep.img}
        url={`/episodio/${ep.number}`}
        type="video.episode"
      />

      <div className="page-hero fade-up visible page-hero--inner" style={{ paddingTop: '2rem' }}>
        <div className="episode-nav">
          <Link to="/" state={{ restoreScroll: true, scrollTo: 'episodios' }} viewTransition className="back-link">← Inicio</Link>
          <Link to="/episodios" state={{ restoreScroll: true }} viewTransition className="back-link">Todos los episodios →</Link>
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
            <h2
              className="ultimo-titulo"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', margin: '0 0 1rem', viewTransitionName: `episode-title-${ep.number}` }}
            >
              {cleanTitle(ep.title)} con <span className="ultimo-invitado">{ep.name}</span>
            </h2>
            {(ep.fecha || ep.duracion) && (
              <p className="episodio-meta">
                {ep.fecha && <time dateTime={ep.fecha}>{formatoFecha(ep.fecha)}</time>}
                {ep.fecha && ep.duracion && ' · '}
                {ep.duracion && `${ep.duracion} min`}
              </p>
            )}
            <p className="ultimo-desc" style={{ fontSize: '1.05rem', marginBottom: '1.5rem' }}><EpisodeDescription episode={ep} /></p>
            {ep.quote && <p className="ultimo-cita">{ep.quote}</p>}
            
            <EpisodeActions key={ep.number} episode={ep} />
          </div>
        </div>

        {ep.notas && (
          <details className="episodio-notas" open>
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
