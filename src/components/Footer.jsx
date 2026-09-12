import { Link } from 'react-router-dom';
import { useScrollTo } from '../hooks/useScrollTo';
import './Footer.css';


export default function Footer() {
  const scrollTo = useScrollTo();

  return (
    <footer>
      <div className="footer-inner">
        <p>&copy; 2026 Desde la Mente de un Adolescente.</p>
        <div className="footer-links">
          <a href="/" onClick={(e) => { e.preventDefault(); scrollTo('inicio', { fallbackTop: true }); }}>Inicio</a>
          <a href="/#acercadma" onClick={(e) => { e.preventDefault(); scrollTo('acercadma'); }}>Acerca</a>
          <Link to="/episodios">Episodios</Link>
          <a href="/#contacto" onClick={(e) => { e.preventDefault(); scrollTo('contacto'); }}>Contacto</a>
        </div>
      </div>
    </footer>
  );
}
