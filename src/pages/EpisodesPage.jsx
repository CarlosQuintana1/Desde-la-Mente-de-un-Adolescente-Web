import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { episodes } from '../data/episodes';
import EpisodeCard from '../components/EpisodeCard';
import '../components/Episodes.css';


export default function EpisodesPage() {
  const [visible, setVisible] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const check = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setVisible(true);
        return true;
      }
      return false;
    };

    if (check()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div className="page-hero reveal visible page-hero--inner">
        <Link to="/" viewTransition className="back-link">← Inicio</Link>
        <h1>Todos los <span className="accent">Episodios</span></h1>
        <p>Explora nuestras conversaciones con mentes brillantes de la ciencia, la tecnología y las artes.</p>
      </div>

      <section className="episodios episodios--page" id="episodios" ref={gridRef}>
        <div className={`episodios-grid${visible ? ' stagger-children' : ''}`}>
          {episodes.map((ep, i) => (
            <EpisodeCard key={ep.number} ep={ep} index={i} sectionProgress={visible ? 1 : 0} />
          ))}
        </div>
      </section>
    </div>
  );
}
