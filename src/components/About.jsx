import { useScrollProgress } from '../hooks/useScrollProgress';
import './About.css';


export default function About() {
  const [ref, progress] = useScrollProgress({ offset: 80 });

  return (
    <section className={`acercadma${progress ? ' is-visible' : ''}`} id="acercadma" ref={ref}>
      <div className="acercadma-content">
        <div className="acercadma-intro">
          <div className="acercadma-tag acercadma-reveal">
            Sobre el podcast
          </div>
          <h2>
            <span className="acercadma-reveal" style={{ '--entrance-delay': '100ms' }}>Entrevistando a</span>{' '}
            <span className="acercadma-accent acercadma-reveal" style={{ '--entrance-delay': '200ms' }}>Mentes Brillantes</span>
          </h2>
        </div>
        <div className="acercadma-details">
          <p>
            <span className="acercadma-line">Un podcast donde cada episodio es una conversación profunda con</span>
            <span className="acercadma-line">personas excepcionales en ciencia, tecnología, arte y humanidades.</span>
            <span className="acercadma-line">Exploramos sus pensamientos, experiencias y consejos para inspirar a</span>
            <span className="acercadma-line"><span className="acercadma-accent">una nueva generación.</span></span>
          </p>
        </div>
      </div>
    </section>
  );
}
