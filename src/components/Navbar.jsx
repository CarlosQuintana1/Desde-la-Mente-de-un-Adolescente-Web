import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollTo } from '../hooks/useScrollTo';
import { SCROLL } from '../data/constants';

const navItems = [
  { sectionId: 'acercadma', label: 'Acerca' },
  { sectionId: 'episodios', label: 'Episodios' },
  { sectionId: 'escuchar', label: 'Escuchar', cta: true },
];

function NavLink({ sectionId, label, onScroll }) {
  const { pathname } = useLocation();

  if (pathname === '/') {
    return (
      <a href={`#${sectionId}`} onClick={(e) => { e.preventDefault(); onScroll(sectionId); }}>
        {label}
      </a>
    );
  }
  return <Link to={`/#${sectionId}`}>{label}</Link>;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL.threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleScroll = (id) => scrollTo(id, { onNav: () => setMenuOpen(false) });

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <Link className="navbar-logo" to="/">
        <img src="assets/img/dm.png" alt="Logo DM Adolescente" />
        <span>DM <span className="highlight">Adolescente</span></span>
      </Link>
      <ul className={`nav-links${menuOpen ? ' active' : ''}`}>
        {navItems.map(({ sectionId, label, cta }) => (
          <li key={sectionId} className={cta ? 'nav-cta' : ''}>
            <NavLink sectionId={sectionId} label={label} onScroll={handleScroll} />
          </li>
        ))}
      </ul>
      <div
        className={`nav-toggle${menuOpen ? ' active' : ''}`}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Menú"
        aria-expanded={menuOpen}
      >
        <span /><span /><span />
      </div>
    </nav>
  );
}
