import { Link } from 'react-router-dom';
import { useScrollTo } from '../hooks/useScrollTo';

export default function Footer() {
  const scrollTo = useScrollTo();

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="assets/img/dm.png" alt="Logo DMA" />
          <span>DM Adolescente</span>
        </div>
        <p>&copy; 2025 Desde la Mente de un Adolescente.</p>
        <div className="footer-links">
          <a href="/" onClick={(e) => { e.preventDefault(); scrollTo('inicio', { fallbackTop: true }); }}>Inicio</a>
          <a href="/#acercadma" onClick={(e) => { e.preventDefault(); scrollTo('acercadma'); }}>Acerca</a>
          <Link to="/episodios">Episodios</Link>
        </div>
      </div>
    </footer>
  );
}
