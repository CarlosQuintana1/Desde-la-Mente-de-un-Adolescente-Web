import { useScrollProgress } from '../hooks/useScrollProgress';
import { scrollRevealStyle } from '../utils/classNames';
import './About.css';


export default function About() {
  const [ref, progress] = useScrollProgress();

  const tagStyle = scrollRevealStyle(progress, 'up', 0);
  const headingStyle = scrollRevealStyle(progress, 'up', 0.08);
  const accentStyle = scrollRevealStyle(progress, 'up', 0.16);
  const paragraphStyle = scrollRevealStyle(progress, 'up', 0.24);

  return (
    <section className="acercadma" id="acercadma" ref={ref}>
      <div className="acercadma-content">
        <div className="acercadma-intro">
          <div className="acercadma-tag" style={tagStyle}>
            Sobre el podcast
          </div>
          <h2>
            <span style={headingStyle}>Entrevistando a</span>{' '}
            <span className="acercadma-accent" style={accentStyle}>Mentes Brillantes</span>
          </h2>
        </div>
        <div className="acercadma-details">
          <p style={paragraphStyle}>
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
