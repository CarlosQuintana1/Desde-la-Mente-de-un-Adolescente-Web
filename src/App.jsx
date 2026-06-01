import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { 
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); 
  }, [pathname]);
  return null;
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  return (
    <HelmetProvider>
      <SEO />
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      <div className="grain-overlay" />
      <Particles />
      <Navbar />
      <ScrollToTop />
      <main id="main-content">
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/episodios" element={<EpisodesPage />} />
            <Route path="/episodio/:id" element={<EpisodeDetail />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </HelmetProvider>
  );
}
