import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div>
      <SEO title="Página no encontrada" />
      <div className="page-hero fade-up visible page-hero--inner" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <h1>Página <span className="accent">no encontrada</span></h1>
        <p style={{ margin: '1.5rem auto' }}>La dirección que abriste no existe o ha cambiado de lugar.</p>
        <Link to="/" className="btn-secondary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
