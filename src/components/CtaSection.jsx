import { useScrollProgress } from '../hooks/useScrollProgress';
import { scrollRevealStyle } from '../utils/classNames';
import { SITE } from '../data/constants';
import './CtaSection.css';


const platforms = [
  { href: SITE.spotify, img: '/assets/img/spotify.webp', label: 'Spotify' },
  { href: SITE.apple, img: '/assets/img/applepodcast.webp', label: 'Apple Podcasts' },
  { href: SITE.deezer, img: '/assets/img/deezer.svg', label: 'Deezer' },
];

export default function CtaSection() {
  const [ref, progress] = useScrollProgress();

  const headingStyle = scrollRevealStyle(progress, 'scale', 0);
  const paragraphStyle = scrollRevealStyle(progress, 'up', 0.1);
  const platformsStyle = scrollRevealStyle(progress, 'scale', 0.2);

  return (
    <section className="cta-section" id="escuchar" ref={ref}>
      <div className="cta-content">
        <h2 style={headingStyle}>Escucha donde prefieras</h2>
        <p style={paragraphStyle}>Disponible en todas las plataformas.</p>
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
