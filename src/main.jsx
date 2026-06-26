import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import App from './App';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

if (window.location.pathname !== '/' || window.location.hash) {
  try {
    sessionStorage.setItem('dm_redirected_from_reload', 'true');
    sessionStorage.removeItem('dm_home_scroll');
  } catch (e) {
    console.error('SessionStorage access failed:', e);
  }
  window.location.replace('/');
} else {
  function RouterGuard() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
      if (pathname.endsWith('episodios.html')) {
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
}
