import { useScrollProgress } from '../hooks/useScrollProgress';
import { stagger, scrollRevealStyle } from '../utils/classNames';
import { SITE } from '../data/constants';
import './CtaSection.css';


const platforms = [
  { href: SITE.spotify, img: '/assets/img/spotify.webp', label: 'Spotify' },
  { href: SITE.apple, img: '/assets/img/applepodcast.webp', label: 'Apple Podcasts' },
];

export default function CtaSection() {
  const [ref, progress] = useScrollProgress();

  const headingStyle = scrollRevealStyle(stagger(progress, 0), 'scale');
  const paragraphStyle = scrollRevealStyle(stagger(progress, 0.1), 'up');
  const platformsStyle = scrollRevealStyle(stagger(progress, 0.2), 'scale');

  return (
    <section className="cta-section" id="escuchar" ref={ref}>
      <div className="cta-content">
        <h2 style={headingStyle}>Escucha donde prefieras</h2>
        <p style={paragraphStyle}>Disponible en todas las plataformas. Suscríbete y no te pierdas ningún episodio.</p>
        <div className="cta-platforms" style={platformsStyle}>
          {platforms.map(({ href, img, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="cta-platform">
              <img src={img} alt="" width={20} height={20} /> {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
