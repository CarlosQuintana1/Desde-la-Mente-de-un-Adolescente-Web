import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Episodes from './components/Episodes';
import ContactForm from './components/ContactForm';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import Particles from './components/Particles';
import EpisodesPage from './pages/EpisodesPage';
import './styles/main.css';

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
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      <div className="grain-overlay" />
      <Particles />
      <Navbar />
      <ScrollToTop />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/episodios" element={<EpisodesPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
