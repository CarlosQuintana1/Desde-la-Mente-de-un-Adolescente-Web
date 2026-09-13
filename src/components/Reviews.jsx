import { useScrollProgress } from '../hooks/useScrollProgress';
import { scrollRevealStyle } from '../utils/classNames';
import './Reviews.css';

const reviews = [
  {
    initial: 'L',
    name: 'Luz Hernandez',
    date: 'hace 3 años',
    text: 'Es un gusto escuchar interesantes temas de mucho aprendizaje y provecho para jóvenes y adultos! Muchas felicidades a los entrevistadores muy profesionales! Fernando lo haces muy bien 🙏',
  },
  {
    initial: 'L',
    name: 'Lula Campos Jimenez',
    date: 'hace 3 años',
    text: '¡Muchas felicidades! cada episodio es súper interesante;este en particular me encantó, no tenía idea de lo maravillosa y extensa que resulta la biotecnología. Me fascinó la idea de los abejorros 💖',
  },
];

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
                <span className="resena-avatar" aria-hidden="true">{review.initial}</span>
                <span className="resena-author-info">
                  <strong>{review.name}</strong>
                  <span>{review.date}</span>
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
