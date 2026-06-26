import { useEffect, useLayoutEffect, useRef, useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Episodes from './components/Episodes';
import ContactForm from './components/ContactForm';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import Particles from './components/Particles';
import SEO from './components/SEO';
import './styles/main.css';

const EpisodesPage = lazy(() => import('./pages/EpisodesPage'));
const EpisodeDetail = lazy(() => import('./pages/EpisodeDetail'));

function RouteLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '3px solid var(--border-strong)',
        borderTopColor: 'var(--accent-light)',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>Cargando...</p>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Episodes />
      <ContactForm />
      <CtaSection />
    </>
  );
}

function ScrollManager({ lenis }) {
  const { pathname, hash, state } = useLocation();
  const navigate = useNavigate();
  const prevPathRef = useRef(pathname);

  useLayoutEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = pathname;

    try {
      if (sessionStorage.getItem('dm_redirected_from_reload') === 'true') {
        sessionStorage.removeItem('dm_redirected_from_reload');
        sessionStorage.removeItem('dm_home_scroll');
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
        return;
      }
    } catch (e) {
      console.error('SessionStorage access failed:', e);
    }

    const scrollToElement = (id) => {
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          if (lenis) {
            lenis.scrollTo(el, { immediate: true });
          } else {
            el.scrollIntoView({ behavior: 'instant' });
          }
        } else if (attempts < 10) {
          attempts++;
          requestAnimationFrame(tryScroll);
        }
      };
      requestAnimationFrame(tryScroll);
    };

    if (hash) {
      scrollToElement(hash.replace('#', ''));
      return;
    }

    if (state?.scrollTo) {
      scrollToElement(state.scrollTo);
      // Clear the scrollTo state from history so a page reload won't re-scroll
      navigate(pathname, { replace: true, state: {} });
      return;
    }

    if (pathname === "/" && prev !== "/") {
      const saved = sessionStorage.getItem('dm_home_scroll');
      if (saved) {
        const y = parseInt(saved, 10);
        if (!isNaN(y)) {
          if (lenis) {
            lenis.scrollTo(y, { immediate: true });
          } else {
            window.scrollTo(0, y);
          }
        }
        sessionStorage.removeItem('dm_home_scroll');
        return;
      }
    } else if (prev === "/" && pathname !== "/") {
      sessionStorage.setItem('dm_home_scroll', String(window.scrollY || 0));
    }

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname, hash, state, lenis]);

  return null;
}

export default function App() {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    setLenis(instance);

    function raf(time) {
      instance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, []);

  const { pathname } = useLocation();

  return (
    <HelmetProvider>
      <SEO />
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      <div className="grain-overlay" />
      <Particles />
      <Navbar />
      <ScrollManager lenis={lenis} />
      <main id="main-content">
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/episodios" element={<EpisodesPage />} />
            <Route path="/episodio/:id" element={<EpisodeDetail />} />
          </Routes>
        </Suspense>
      </main>
      {!pathname.startsWith('/episodio/') && <Footer />}
    </HelmetProvider>
  );
}
