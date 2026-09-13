import { useScrollProgress } from '../hooks/useScrollProgress';
import { scrollRevealStyle } from '../utils/classNames';
import './About.css';


export default function About() {
  const [ref, progress] = useScrollProgress();

  const tagStyle = scrollRevealStyle(progress, 'up', 0);
  const headingStyle = scrollRevealStyle(progress, 'left', 0.08);
  const paragraphStyle = scrollRevealStyle(progress, 'right', 0.16);
  const hostStyle = scrollRevealStyle(progress, 'scale', 0.24);

  return (
    <section className="acercadma" id="acercadma" ref={ref}>
      <div className="acercadma-content">
        <div className="acercadma-intro">
          <div className="acercadma-tag" style={tagStyle}>
            Sobre el podcast
          </div>
          <h2 style={headingStyle}>
            Entrevistando a mentes brillantes que están redefiniendo el futuro
          </h2>
        </div>
        <div className="acercadma-details">
          <p style={paragraphStyle}>
            <strong>Desde la Mente de un Adolescente</strong> es un podcast donde cada
            episodio es una conversación profunda con personas excepcionales en ciencia,
            tecnología, arte y humanidades. Exploramos sus
            pensamientos, experiencias y consejos para inspirar a una nueva generación.
          </p>
          <div className="acercadma-host" style={hostStyle}>
            <span>Creado por <strong>Carlos Quintana</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}
