import { Link } from 'react-router-dom';
import { episodes } from '../data/episodes';
import { useInView } from '../hooks/useInView';
import { fadeUp } from '../utils/classNames';
import EpisodeCard from './EpisodeCard';

export default function Episodes() {
  const [ref, visible] = useInView();

  return (
    <section className="episodios" id="episodios" ref={ref}>
      <div className={fadeUp('episodios-header', visible)}>
        <div className="episodios-header-left">
          <h2>Episodios <span className="count">· {episodes.length}</span></h2>
          <p>Cada conversación, una nueva perspectiva.</p>
        </div>
        <div className="episodios-header-right">
          <Link to="/episodios" className="btn-secondary">Ver todos →</Link>
        </div>
      </div>

      <div className="episodios-grid">
        {episodes.map((ep, i) => (
          <EpisodeCard key={ep.number} ep={ep} index={i} sectionVisible={visible} />
        ))}
      </div>
    </section>
  );
}
