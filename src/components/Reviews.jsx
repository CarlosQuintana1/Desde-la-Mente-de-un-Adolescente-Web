import { useScrollProgress } from '../hooks/useScrollProgress';
import { scrollRevealStyle } from '../utils/classNames';
import './Reviews.css';

const reviews = [
  {
    avatarColor: 'orange',
    name: 'Luz Hernández',
    text: 'Es un gusto escuchar interesantes temas de mucho aprendizaje y provecho para jóvenes y adultos. ¡Muchas felicidades a los entrevistadores, muy profesionales!',
  },
  {
    avatarColor: 'green',
    name: 'Lula Campos Jiménez',
    text: '¡Muchas felicidades! Cada episodio es súper interesante; este en particular me encantó. No tenía idea de lo maravillosa y extensa que resulta la biotecnología. Me fascinó la idea de los abejorros 💖',
  },
  {
    avatarColor: 'purple',
    name: 'yuliana.sogo',
    text: '¡Qué episodio tan educativo 🥺! Justamente voy a estudiar una carrera muy relacionada con la biotecnología roja. Gracias por el aprendizaje 💗',
  },
];

function PersonIcon() {
  return (
    <svg viewBox="0 0 32 32" width="24" height="24" fill="none" aria-hidden="true">
      <circle cx="16" cy="10" r="5" fill="currentColor" />
      <path d="M7 27c.8-5.2 4.1-8.2 9-8.2s8.2 3 9 8.2" fill="currentColor" />
    </svg>
  );
}

export default function Reviews() {
  const [ref, progress] = useScrollProgress();

  return (
    <section className="resenas" id="resenas" ref={ref}>
      <div className="resenas-container">
        <div className="resenas-header" style={scrollRevealStyle(progress, 'up', 0)}>
          <span className="resenas-tag">Reseñas</span>
          <h2>Lo que dicen del podcast</h2>
        </div>

        <div className="resenas-grid">
          {reviews.map((review, index) => (
            <figure
              className="resena-card"
              key={review.name}
              style={scrollRevealStyle(progress, 'up', 0.1 + index * 0.1)}
            >
              <figcaption className="resena-author">
                <span className={`resena-avatar resena-avatar-${review.avatarColor}`} aria-hidden="true">
                  <PersonIcon />
                </span>
                <span className="resena-author-info">
                  <strong>{review.name}</strong>
                </span>
              </figcaption>
              <blockquote>{review.text}</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
