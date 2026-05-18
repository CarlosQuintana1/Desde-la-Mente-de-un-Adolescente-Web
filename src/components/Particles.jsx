import { useEffect } from 'react';

export default function Particles() {
  useEffect(() => {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = 30;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 1 + Math.random() * 2;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDuration = `${15 + Math.random() * 25}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      p.style.opacity = `${0.08 + Math.random() * 0.12}`;
      container.appendChild(p);
    }

    return () => { container.innerHTML = ''; };
  }, []);

  return <div className="particles" id="particles" />;
}
