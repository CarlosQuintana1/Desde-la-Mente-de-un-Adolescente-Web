import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import ScrollManager from './components/ScrollManager';
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
    <div data-scroll-page="/">
      <Hero />
      <About />
      <Episodes />
      <Reviews />
      <ContactForm />
      <CtaSection />
    </div>
  );
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
