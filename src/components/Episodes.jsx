import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { episodes } from '../data/episodes';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { scrollRevealStyle } from '../utils/classNames';
import EpisodeCard from './EpisodeCard';
import EpisodeActions from './EpisodeActions';
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
  const [ref, progress] = useScrollProgress();
  const sliderRef = useRef(null);
  const scrollAnimationRef = useRef(null);
  const targetScrollLeftRef = useRef(0);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const latestEp = episodes[0];
  const recentEpisodes = episodes.slice(1);

  const updateScrollButtons = () => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    setCanScrollLeft(currentScroll > 8);
    setCanScrollRight(currentScroll < maxScroll - 40);
  };

  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;

    updateScrollButtons();

    container.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      container.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  const scroll = (direction) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const firstItem = container.querySelector('.carousel-item');
    
    let scrollStep = 344;
    if (firstItem) {
      const cardWidth = firstItem.offsetWidth;
      const style = window.getComputedStyle(container);
      const gap = parseFloat(style.columnGap || style.gap) || 24;
      scrollStep = cardWidth + gap;
    }

    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
    }

    const currentScroll = container.scrollLeft;
    
    if (Math.abs(currentScroll - targetScrollLeftRef.current) > 10) {
      targetScrollLeftRef.current = currentScroll;
    }

    const change = direction === 'left' ? -scrollStep : scrollStep;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const targetScroll = Math.max(0, Math.min(targetScrollLeftRef.current + change, maxScroll));
    targetScrollLeftRef.current = targetScroll;

    const start = container.scrollLeft;
    const distance = targetScroll - start;
    const duration = 500;
    let startTime = null;

    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const p = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(p);
      
      container.scrollLeft = start + distance * ease;
      updateScrollButtons();

      if (p < 1) {
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

    const displayCategory = category.includes('·')
      ? category.split('·').slice(1).join('·').trim()
      : category;

    return (
      <span className={config.className}>
        {config.icon}
        {displayCategory}
      </span>
    );
  };

  const cleanTitle = (title) => {
    return title.replace(/Dedicar tu vida a( la | los |l )/i, '');
  };

  const titleStyle = scrollRevealStyle(progress, 'up', 0);
  const cardStyle = scrollRevealStyle(progress, 'scale', 0.1);
  const imgStyle = scrollRevealStyle(progress, 'left', 0.15);
  const categoryStyle = scrollRevealStyle(progress, 'up', 0.2);
  const episodeTitleStyle = scrollRevealStyle(progress, 'right', 0.25);
  const descStyle = scrollRevealStyle(progress, 'blur', 0.3);
  const citaStyle = scrollRevealStyle(progress, 'scale', 0.35);
  const actionsStyle = scrollRevealStyle(progress, 'up', 0.4);
  const recentHeaderStyle = scrollRevealStyle(progress, 'up', 0.5);
  const carouselStyle = scrollRevealStyle(progress, 'scale', 0.6);

  return (
    <section className="episodios" id="episodios" ref={ref}>
      <div className="ultimo-episodio-section">
        <div className="section-title-wrap" style={titleStyle}>
          <div className="line" />
          <h2 className="section-tag-title">Último Episodio</h2>
          <div className="line" />
        </div>

        <div className="ultimo-episodio-card" style={cardStyle}>
          <div className="ultimo-img-wrap" style={imgStyle}>
            <span className="episodio-number">EP {latestEp.number}</span>
            <img
              src={latestEp.img}
              alt={latestEp.alt}
              width={400}
              height={400}
              loading="eager"
              style={{ viewTransitionName: `episode-cover-${latestEp.number}` }}
            />
          </div>
          <div className="ultimo-info">
            <div style={categoryStyle}>
              {renderCategoryBadge(latestEp.category)}
            </div>
            <h3
              className="ultimo-titulo"
              style={{ ...episodeTitleStyle, viewTransitionName: `episode-title-${latestEp.number}` }}
            >
              {cleanTitle(latestEp.title)} con <span className="ultimo-invitado">{latestEp.name}</span>
            </h3>
            <p className="ultimo-desc" style={descStyle}>{latestEp.desc}</p>
            {latestEp.quote && <p className="ultimo-cita" style={citaStyle}>{latestEp.quote}</p>}
            
            <EpisodeActions key={latestEp.number} episode={latestEp} style={actionsStyle} />
          </div>
        </div>
      </div>

      <div className="recientes-section">
        <div className="recientes-header" style={recentHeaderStyle}>
          <h2>Episodios Recientes</h2>
          <Link to="/episodios" state={{ restoreScroll: true }} viewTransition className="btn-secondary header-view-all">Ver todos los episodios →</Link>
        </div>

        <div className="carousel-wrapper" style={carouselStyle} role="region" aria-roledescription="carrusel" aria-label="Episodios recientes">
          <button 
            className={`carousel-arrow btn-prev${!canScrollLeft ? ' hidden' : ''}`} 
            onClick={() => scroll('left')} 
            aria-label="Ir al episodio anterior"
            disabled={!canScrollLeft}
            tabIndex={!canScrollLeft ? -1 : 0}
          >
            ‹
          </button>
          
          <div className={`carousel-container${!canScrollLeft ? ' at-start' : ''}${!canScrollRight ? ' at-end' : ''}`}>
            <div 
              className="carousel-track" 
              data-scroll-key="recent-episodes"
              ref={sliderRef}
              role="presentation"
            >
              {recentEpisodes.map((ep, i) => (
                <div 
                  key={ep.number} 
                  className="carousel-item"
                  role="group"
                  aria-roledescription="diapositiva"
                  aria-label={`${i + 1} de ${recentEpisodes.length}`}
                >
                  <EpisodeCard ep={ep} index={i} sectionProgress={progress} />
                </div>
              ))}
            </div>
          </div>

          <button 
            className={`carousel-arrow btn-next${!canScrollRight ? ' hidden' : ''}`} 
            onClick={() => scroll('right')} 
            aria-label="Ir al siguiente episodio"
            disabled={!canScrollRight}
            tabIndex={!canScrollRight ? -1 : 0}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
