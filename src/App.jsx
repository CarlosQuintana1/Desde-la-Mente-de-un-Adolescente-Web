import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Episodes from './components/Episodes';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import Particles from './components/Particles';
import EpisodesPage from './pages/EpisodesPage';
import { useCursorGlow } from './hooks/useCursorGlow';
import './styles/main.css';

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Episodes />
      <CtaSection />
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  useCursorGlow();

  return (
    <>
      <div className="grain-overlay" />
      <Particles />
      <Navbar />
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/episodios" element={<EpisodesPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
