import { useEffect, useLayoutEffect, useRef, useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Lenis from 'lenis';
import Hero from './components/Hero';
import About from './components/About';
import Episodes from './components/Episodes';
import Reviews from './components/Reviews';
import ContactForm from './components/ContactForm';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import SEO from './components/SEO';
import './styles/main.css';

import NotFound from './pages/NotFound';

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
      <Reviews />
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

    let timer = null;
    let onLoad = null;
    let cancelled = false;
    const stop = () => { cancelled = true; };
    const userEvents = ['wheel', 'touchstart', 'keydown'];
    const listen = () => userEvents.forEach((e) => window.addEventListener(e, stop, { passive: true }));
    const unlisten = () => userEvents.forEach((e) => window.removeEventListener(e, stop));

    // al entrar por URL el layout sigue creciendo mientras cargan las imagenes, asi que se recorrige hasta que la seccion deja de moverse
    const scrollToElement = (id, holdMs = 500) => {
      const hardStop = performance.now() + 10000;
      let deadline = performance.now() + holdMs;
      let lastTop = null;

      if (document.readyState !== 'complete') {
        onLoad = () => { deadline = Math.max(deadline, performance.now() + 500); };
        window.addEventListener('load', onLoad, { once: true });
      }

      const attempt = () => {
        timer = null;
        if (cancelled) return unlisten();

        const el = document.getElementById(id);
        if (el) {
          const top = Math.round(el.getBoundingClientRect().top);
          if (top !== lastTop) {
            lastTop = top;
            if (lenis) {
              lenis.resize();
              lenis.scrollTo(el, { immediate: true, force: true });
            } else {
              el.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
          }
        }

        const now = performance.now();
        if (now < deadline && now < hardStop) timer = setTimeout(attempt, 50);
        else unlisten();
      };

      listen();
      attempt();
    };

    const run = () => {
      if (hash) {
        scrollToElement(hash.replace('#', ''), 2000);
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
    };

    run();

    return () => {
      cancelled = true;
      if (timer != null) clearTimeout(timer);
      if (onLoad) window.removeEventListener('load', onLoad);
      unlisten();
    };
  }, [pathname, hash, state, lenis]);

  return null;
}

export default function App() {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    // en tactil el scroll nativo ya es suave y corre fuera del hilo principal;
    // Lenis solo dejaria un bucle de 60 cuadros por segundo vivo sin aportar nada
    if (window.matchMedia('(pointer: coarse), (max-width: 768px), (prefers-reduced-motion: reduce)').matches) return;

    // lerp en vez de duration: el scroll sigue el gesto en vez de animar 1.2s hacia un destino
    const instance = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    setLenis(instance);

    let id;
    function raf(time) {
      instance.raf(time);
      id = requestAnimationFrame(raf);
    }

    id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  const { pathname } = useLocation();

  return (
    <HelmetProvider>
      <SEO />
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      <ScrollManager lenis={lenis} />
      <main id="main-content">
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/episodios" element={<EpisodesPage />} />
            <Route path="/episodio/:id" element={<EpisodeDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!pathname.startsWith('/episodio/') && <Footer />}
    </HelmetProvider>
  );
}
