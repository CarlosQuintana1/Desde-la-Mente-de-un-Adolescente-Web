import { useSectionEntrance } from '../hooks/useSectionEntrance';
import './About.css';


export default function About() {
  const ref = useSectionEntrance();

  return (
    <section className="acercadma" id="acercadma" ref={ref}>
      <div className="acercadma-content">
        <div className="acercadma-intro">
          <div className="acercadma-tag" data-entrance>
            Un Podcast
          </div>
          <h2>
            <span data-entrance style={{ '--entrance-delay': '60ms' }}>Entrevistando a</span>{' '}
            <span className="acercadma-accent" data-entrance style={{ '--entrance-delay': '120ms' }}>Mentes Brillantes</span>
          </h2>
        </div>
        <div className="acercadma-details" data-entrance style={{ '--entrance-delay': '180ms' }}>
          <p>
            <span className="acercadma-line">Cada episodio es una conversación profunda con</span>
            <span className="acercadma-line">personas excepcionales en ciencia, tecnología, arte y humanidades.</span>
            <span className="acercadma-line">Exploramos sus pensamientos, experiencias y consejos para inspirar a</span>
            <span className="acercadma-line"><span className="acercadma-accent">una nueva generación.</span></span>
          </p>
        </div>
      </div>
    </section>
  );
}
