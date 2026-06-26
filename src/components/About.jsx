import { useScrollProgress } from '../hooks/useScrollProgress';
import { stagger, scrollRevealStyle } from '../utils/classNames';
import './About.css';


export default function About() {
  const [ref, progress] = useScrollProgress();

  const tagStyle = scrollRevealStyle(stagger(progress, 0), 'up');
  const headingStyle = scrollRevealStyle(stagger(progress, 0.08), 'left');
  const paragraphStyle = scrollRevealStyle(stagger(progress, 0.16), 'right');
  const hostStyle = scrollRevealStyle(stagger(progress, 0.24), 'scale');

  return (
    <section className="acercadma" id="acercadma" ref={ref}>
      <div className="acercadma-content">
        <div className="acercadma-tag" style={tagStyle}>
          Sobre el podcast
        </div>
        <h2 style={headingStyle}>
          Entrevistando a <span className="accent">mentes brillantes</span><br />
          que están redefiniendo el futuro
        </h2>
        <p style={paragraphStyle}>
          <strong>Desde la Mente de un Adolescente</strong> es un podcast creado por
          Carlos Quintana, donde cada episodio es una conversación profunda con personas
          excepcionales en ciencia, tecnología, arte y humanidades. Exploramos sus
          pensamientos, experiencias y consejos para inspirar a una nueva generación.
        </p>
        <div className="acercadma-host" style={hostStyle}>
          <div className="line" />
          <span>Creado por <strong>Carlos Quintana</strong></span>
          <div className="line" />
        </div>
      </div>
    </section>
  );
}
