import { useInView } from '../hooks/useInView';
import { fadeUp } from '../utils/classNames';
import './About.css';


export default function About() {
  const [ref, visible] = useInView();

  return (
    <section className="acercadma" id="acercadma" ref={ref}>
      <div className={fadeUp('acercadma-content', visible)}>
        <div className="acercadma-tag">Sobre el podcast</div>
        <h2>
          Entrevistando a <span className="accent">mentes brillantes</span><br />
          que están redefiniendo el futuro
        </h2>
        <p>
          <strong>Desde la Mente de un Adolescente</strong> es un podcast creado por
          Carlos Quintana, donde cada episodio es una conversación profunda con personas
          excepcionales en ciencia, tecnología, arte y humanidades. Exploramos sus
          pensamientos, experiencias y consejos para inspirar a una nueva generación.
        </p>
        <div className="acercadma-host">
          <div className="line" />
          <span>Creado por <strong>Carlos Quintana</strong></span>
          <div className="line" />
        </div>
      </div>
    </section>
  );
}
