import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollTo } from '../hooks/useScrollTo';
import { SCROLL } from '../data/constants';
import './Navbar.css';


const navItems = [
  { sectionId: 'acercadma', label: 'Acerca' },
  { sectionId: 'episodios', label: 'Episodios' },
  { sectionId: 'contacto', label: 'Contacto' },
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
  return <Link to={`/#${sectionId}`} viewTransition>{label}</Link>;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const scrollTo = useScrollTo();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > SCROLL.threshold);

      // Hide on scroll down past 120px, reveal on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 120 && !menuOpen) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? 'hidden' : '';
      return next;
    });
  };

  const handleScroll = (id) => scrollTo(id, { 
    onNav: () => {
      setMenuOpen(false);
      document.body.style.overflow = '';
    } 
  });

  return (
    <nav className={`navbar${(scrolled || !isHomePage) ? ' scrolled' : ''}${isHomePage ? ' is-home' : ''}${!visible ? ' navbar-hidden' : ''}`}>
      <Link className="navbar-logo" to="/" viewTransition>
        <img src="/assets/img/dm.webp" alt="Logo DM Adolescente" width={40} height={40} />
        <span>DM <span className="highlight">Adolescente</span></span>
      </Link>
      <ul className={`nav-links${menuOpen ? ' active' : ''}`}>
        {navItems.map(({ sectionId, label, cta }) => (
          <li key={sectionId} className={cta ? 'nav-cta' : ''}>
            <NavLink sectionId={sectionId} label={label} onScroll={handleScroll} />
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={`nav-toggle${menuOpen ? ' active' : ''}`}
        onClick={toggleMenu}
        aria-label="Menú"
        aria-expanded={menuOpen}
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}
