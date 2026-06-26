import { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BREAKPOINTS, TILT, TIMING } from '../data/constants';
import { stagger, scrollRevealStyle } from '../utils/classNames';
import ScienceIcon from './icons/ScienceIcon';
import TechIcon from './icons/TechIcon';
import ArtIcon from './icons/ArtIcon';
import './EpisodeCard.css';

const CATEGORY_CONFIG = {
  Ciencia: { className: 'episodio-category episodio-category-ciencia', icon: <ScienceIcon /> },
  Tecnologia: { className: 'episodio-category episodio-category-tecnologia', icon: <TechIcon /> },
  Arte: { className: 'episodio-category episodio-category-arte', icon: <ArtIcon /> },
};

export default function EpisodeCard({ ep, index, sectionProgress }) {
  const wrapperRef = useRef(null);
  const cardRef = useRef(null);
  const rectRef = useRef(null);

  const staggerDelay = (index % 4) * 0.08;
  const cardStyle = scrollRevealStyle(stagger(sectionProgress, staggerDelay), 'up', { transition: true });

  const handleMouseEnter = useCallback(() => {
    if (wrapperRef.current && cardRef.current) {
      rectRef.current = wrapperRef.current.getBoundingClientRect();
      cardRef.current.style.transition = 'transform 0.15s ease-out';
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (window.innerWidth <= BREAKPOINTS.tablet || !cardRef.current) return;
    const rect = rectRef.current;
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -TILT.maxAngle;
    const ry = ((x - cx) / cx) * TILT.maxAngle;
    cardRef.current.style.transform =
      `perspective(${TILT.perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-${TILT.lift}px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = `transform ${TIMING.tiltTransition}s ease-out, background 0.4s ease, box-shadow 0.4s ease`;
    cardRef.current.style.transform = '';
    const el = cardRef.current;
    setTimeout(() => {
      if (el) el.style.transition = '';
    }, TIMING.tiltResetDelay);
  }, []);

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

  return (
    <div 
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...cardStyle, height: '100%', perspective: '1000px' }}
    >
      <article
        className="episodio-card"
        ref={cardRef}
      >
        <Link 
          to={`/episodio/${ep.number}`} 
          viewTransition 
          className="stretched-link" 
          aria-label={`Ver episodio ${ep.number}: ${ep.title}`}
        />
        <div className="episodio-img-wrap" style={{ aspectRatio: '1 / 1' }}>
          <span className="episodio-number">EP {ep.number}</span>
          <img className="episodio-img" src={ep.img} alt={ep.alt} loading="lazy" width={400} height={400} style={{ aspectRatio: '1 / 1', objectFit: 'cover' }} />
        </div>
        <div className="episodio-info">
          {renderCategoryBadge(ep.category)}
          <h3 className="episodio-titulo">{ep.title}</h3>
          <span className="episodio-nombres">{ep.name}</span>
          <span className="episodio-descrip">{ep.desc}</span>
          {ep.quote && <span className="episodio-cita">{ep.quote}</span>}
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
      </article>
    </div>
  );
}
