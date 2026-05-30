import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { episodes } from '../data/episodes';
import { useInView } from '../hooks/useInView';
import { fadeUp } from '../utils/classNames';
import EpisodeCard from './EpisodeCard';
import ScienceIcon from './icons/ScienceIcon';
import TechIcon from './icons/TechIcon';
import ArtIcon from './icons/ArtIcon';
import PlayIcon from './icons/PlayIcon';
import './Episodes.css';

const CATEGORY_CONFIG = {
  Ciencia: { className: 'episodio-category episodio-category-ciencia', icon: <ScienceIcon /> },
  Tecnologia: { className: 'episodio-category episodio-category-tecnologia', icon: <TechIcon /> },
  Arte: { className: 'episodio-category episodio-category-arte', icon: <ArtIcon /> },
};

const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export default function Episodes() {
  const [ref, visible] = useInView({ rootMargin: '0px 0px -150px 0px', threshold: 0.1 });
  const sliderRef = useRef(null);
  const scrollAnimationRef = useRef(null);
  const targetScrollLeftRef = useRef(0);

  const latestEp = episodes[0];
  const recentEpisodes = episodes.slice(1);

  const scroll = (direction) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const firstItem = container.querySelector('.carousel-item');
    
    // Determine scroll step width + gap
    let scrollStep = 344;
    if (firstItem) {
      const cardWidth = firstItem.offsetWidth;
      const style = window.getComputedStyle(container);
      const gap = parseFloat(style.columnGap || style.gap) || 24;
      scrollStep = cardWidth + gap;
    }

    // Cancel any active animation to allow fluid rapid-fire clicks
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
    }

    const currentScroll = container.scrollLeft;
    
    // If the user manually swiped or scrolled, synchronize our target ref
    if (Math.abs(currentScroll - targetScrollLeftRef.current) > 10) {
      targetScrollLeftRef.current = currentScroll;
    }

    // Calculate new target scroll position
    const change = direction === 'left' ? -scrollStep : scrollStep;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const targetScroll = Math.max(0, Math.min(targetScrollLeftRef.current + change, maxScroll));
    targetScrollLeftRef.current = targetScroll;

    // Custom fluid easing transition (easeInOutCubic)
    const start = container.scrollLeft;
    const distance = targetScroll - start;
    const duration = 500; // Perfect 500ms fluid duration
    let startTime = null;

    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      
      container.scrollLeft = start + distance * ease;

      if (progress < 1) {
        scrollAnimationRef.current = requestAnimationFrame(animate);
      } else {
        scrollAnimationRef.current = null;
      }
    };

    scrollAnimationRef.current = requestAnimationFrame(animate);
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

  // Clean the title prefix to show field name concisely (e.g. Ep #10: Química con Nina Padme)
  const cleanTitle = (title) => {
    return title.replace(/Dedicar tu vida a( la | los |l )/i, '');
  };

  return (
    <section className="episodios" id="episodios" ref={ref}>
      {/* 1. FEATURED LATEST EPISODE HIGHLIGHT */}
      <div className={fadeUp('ultimo-episodio-section', visible)}>
        <div className="section-title-wrap">
          <div className="line" />
          <h2 className="section-tag-title">Último Episodio</h2>
          <div className="line" />
        </div>

        <div className="ultimo-episodio-card">
          <div className="ultimo-img-wrap">
            <span className="episodio-number">EP {latestEp.number}</span>
            <img src={latestEp.img} alt={latestEp.alt} width={400} height={400} loading="eager" />
          </div>
          <div className="ultimo-info">
            {renderCategoryBadge(latestEp.category)}
            <h3 className="ultimo-titulo">
              Ep #{latestEp.number}: {cleanTitle(latestEp.title)} con <span className="highlight">{latestEp.name}</span>
            </h3>
            <p className="ultimo-desc">{latestEp.desc}</p>
            {latestEp.quote && <p className="ultimo-cita">{latestEp.quote}</p>}
            
            <div className="ultimo-actions">
              <a href={latestEp.links.spotify} target="_blank" rel="noopener noreferrer" className="btn-primary btn-play">
                <span>
                  <PlayIcon className="btn-play-icon" />
                  Reproducir ahora
                </span>
              </a>
              <div className="episodio-links">
                <a href={latestEp.links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <img src="/assets/img/instagram.webp" alt="Instagram" width={18} height={18} />
                </a>
                <a href={latestEp.links.spotify} target="_blank" rel="noopener noreferrer" aria-label="Spotify">
                  <img src="/assets/img/spotify.webp" alt="Spotify" width={18} height={18} />
                </a>
                <a href={latestEp.links.apple} target="_blank" rel="noopener noreferrer" aria-label="Apple Podcasts">
                  <img src="/assets/img/applepodcast.webp" alt="Apple Podcasts" width={18} height={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RECENT EPISODES SLIDER */}
      <div className={fadeUp('recientes-section', visible)}>
        <div className="recientes-header">
          <h2>Episodios Recientes</h2>
        </div>

        <div className="carousel-wrapper">
          <button className="carousel-arrow btn-prev" onClick={() => scroll('left')} aria-label="Deslizar izquierda">‹</button>
          
          <div className="carousel-container">
            <div className="carousel-track" ref={sliderRef}>
              {recentEpisodes.map((ep, i) => (
                <div key={ep.number} className="carousel-item">
                  <EpisodeCard ep={ep} index={i} sectionVisible={true} />
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-arrow btn-next" onClick={() => scroll('right')} aria-label="Deslizar derecha">›</button>
        </div>

        <div className="recientes-view-all">
          <Link to="/episodios" viewTransition className="btn-secondary">Ver todos los episodios →</Link>
        </div>
      </div>
    </section>
  );
}
