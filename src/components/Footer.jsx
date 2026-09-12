import { Link } from 'react-router-dom';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { scrollRevealStyle } from '../utils/classNames';
import { useScrollTo } from '../hooks/useScrollTo';
import './Footer.css';


export default function Footer() {
  const scrollTo = useScrollTo();
  const [ref, progress] = useScrollProgress();

  const copyrightStyle = scrollRevealStyle(progress, 'blur', 0.1);
  const linksStyle = scrollRevealStyle(progress, 'scale', 0.2);

  return (
    <footer ref={ref}>
      <div className="footer-inner">
        <p style={copyrightStyle}>&copy; 2026 Desde la Mente de un Adolescente.</p>
        <div className="footer-links" style={linksStyle}>
          <a href="/" onClick={(e) => { e.preventDefault(); scrollTo('inicio', { fallbackTop: true }); }}>Inicio</a>
          <a href="/#acercadma" onClick={(e) => { e.preventDefault(); scrollTo('acercadma'); }}>Acerca</a>
          <Link to="/episodios">Episodios</Link>
          <a href="/#contacto" onClick={(e) => { e.preventDefault(); scrollTo('contacto'); }}>Contacto</a>
        </div>
      </div>
    </footer>
  );
}
