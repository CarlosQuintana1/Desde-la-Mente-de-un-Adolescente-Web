import { Link } from 'react-router-dom';
import { episodes } from '../data/episodes';
import EpisodeCard from '../components/EpisodeCard';

export default function EpisodesPage() {
  return (
    <div>
      <div className="page-hero fade-up visible page-hero--inner">
        <Link to="/" className="back-link">← Inicio</Link>
        <h1>Todos los <span className="accent">Episodios</span></h1>
        <p>Explora nuestras conversaciones con mentes brillantes de la ciencia, la tecnología y las artes.</p>
      </div>

      <section className="episodios episodios--page" id="episodios">
        <div className="episodios-grid">
          {episodes.map((ep, i) => (
            <EpisodeCard key={ep.number} ep={ep} index={i} sectionVisible={true} />
          ))}
        </div>
      </section>
    </div>
  );
}
