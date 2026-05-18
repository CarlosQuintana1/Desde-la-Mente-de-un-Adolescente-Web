import { useRef, useCallback } from 'react';
import { BREAKPOINTS, TILT, TIMING } from '../data/constants';

export default function EpisodeCard({ ep, index, sectionVisible }) {
  const wrapperRef = useRef(null);
  const cardRef = useRef(null);
  const rectRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    if (wrapperRef.current && cardRef.current) {
      // Use the stable wrapper for bounding rect to prevent jitter
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

  const stagger = (index % 4) + 1;

  return (
    <div 
      className={`fade-up stagger-${stagger}${sectionVisible ? ' visible' : ''}`}
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ height: '100%', perspective: '1000px' }}
    >
      <article
        className="episodio-card"
        ref={cardRef}
      >
        <div className="episodio-img-wrap">
          <span className="episodio-number">EP {ep.number}</span>
          <img className="episodio-img" src={ep.img} alt={ep.alt} loading="lazy" />
        </div>
        <div className="episodio-info">
          <span className="episodio-category">{ep.category}</span>
          <h3 className="episodio-titulo">{ep.title}</h3>
          <span className="episodio-nombres">{ep.name}</span>
          <span className="episodio-descrip">{ep.desc}</span>
          {ep.quote && <span className="episodio-cita">{ep.quote}</span>}
          <div className="episodio-links">
            <a href={ep.links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src="assets/img/instagram.png" alt="Instagram" />
            </a>
            <a href={ep.links.spotify} target="_blank" rel="noopener noreferrer" aria-label="Spotify">
              <img src="assets/img/spotify.png" alt="Spotify" />
            </a>
            <a href={ep.links.apple} target="_blank" rel="noopener noreferrer" aria-label="Apple Podcasts">
              <img src="assets/img/applepodcast.png" alt="Apple Podcasts" />
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
