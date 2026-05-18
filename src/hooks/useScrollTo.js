import { useLocation, useNavigate } from 'react-router-dom';
import { TIMING } from '../data/constants';

export function useScrollTo() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const doScroll = (id, block, fallbackTop) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block });
    } else if (fallbackTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (id, opts = {}) => {
    const { block = 'start', fallbackTop = false, onNav } = opts;

    if (pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        doScroll(id, block, fallbackTop);
        onNav?.();
      }, TIMING.scrollDelay);
    } else {
      doScroll(id, block, fallbackTop);
      onNav?.();
    }
  };
}
