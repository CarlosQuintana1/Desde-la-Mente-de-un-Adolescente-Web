import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import App from './App';

function RouterGuard() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.endsWith('episodios.html') || pathname.endsWith('episodios')) {
      navigate('/episodios', { replace: true });
    }
  }, [pathname, navigate]);

  return null;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <RouterGuard />
      <App />
    </BrowserRouter>
  </StrictMode>
);
