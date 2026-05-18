import { useInView } from '../hooks/useInView';
import { fadeUp } from '../utils/classNames';
import { SITE } from '../data/constants';

const platforms = [
  { href: SITE.spotify, img: 'assets/img/spotify.png', label: 'Spotify' },
  { href: SITE.apple, img: 'assets/img/applepodcast.png', label: 'Apple Podcasts' },
  { href: SITE.instagram, img: 'assets/img/instagram.png', label: 'Instagram' },
];

export default function CtaSection() {
  const [ref, visible] = useInView();

  return (
    <section className="cta-section" id="escuchar" ref={ref}>
      <div className={fadeUp('cta-content', visible)}>
        <h2>Escucha donde prefieras</h2>
        <p>Disponible en todas las plataformas. Suscríbete y no te pierdas ningún episodio.</p>
        <div className="cta-platforms">
          {platforms.map(({ href, img, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="cta-platform">
              <img src={img} alt="" /> {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
