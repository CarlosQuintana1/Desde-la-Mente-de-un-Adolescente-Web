import { Link } from 'react-router-dom';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { stagger, scrollRevealStyle } from '../utils/classNames';
import { useScrollTo } from '../hooks/useScrollTo';
import './Footer.css';


export default function Footer() {
  const scrollTo = useScrollTo();
  const [ref, progress] = useScrollProgress();

  const brandStyle = scrollRevealStyle(stagger(progress, 0), 'up');
  const copyrightStyle = scrollRevealStyle(stagger(progress, 0.1), 'blur');
  const linksStyle = scrollRevealStyle(stagger(progress, 0.2), 'scale');

  return (
    <footer ref={ref}>
      <div className="footer-inner">
        <div className="footer-brand" style={brandStyle}>
          <img src="/assets/img/dm.webp" alt="Logo DMA" width={32} height={32} />
          <span>DM Adolescente</span>
        </div>
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
