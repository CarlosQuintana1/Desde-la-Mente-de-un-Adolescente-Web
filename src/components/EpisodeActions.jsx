import { useState } from 'react';

function getSpotifyEpisodeId(url) {
  try {
    const segments = new URL(url).pathname.split('/').filter(Boolean);
    const episodeIndex = segments.indexOf('episode');
    return episodeIndex >= 0 ? segments[episodeIndex + 1] : null;
  } catch {
    return null;
  }
}

export default function EpisodeActions({ episode, style }) {
  const [isOpen, setIsOpen] = useState(false);
  const episodeId = getSpotifyEpisodeId(episode.links.spotify);
  const embedId = `spotify-embed-${episodeId}`;

  return (
    <>
      <div className="ultimo-actions" style={style}>
        {episodeId && (
          <button
            type="button"
            className="btn-primary btn-play"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls={isOpen ? embedId : undefined}
          >
            <span>
              <img src="/assets/img/spotify.webp" alt="" width="18" height="18" aria-hidden="true" />
              {isOpen ? 'Ocultar reproductor' : 'Escuchar en la página'}
            </span>
          </button>
        )}
        <div className="episodio-links">
          <a href={episode.links.instagram} target="_blank" rel="noopener noreferrer">
            <img src="/assets/img/instagram.webp" alt="" width="18" height="18" />
            <span>Instagram</span>
          </a>
          <a href={episode.links.apple} target="_blank" rel="noopener noreferrer">
            <img src="/assets/img/applepodcast.webp" alt="" width="18" height="18" />
            <span>Apple Podcasts</span>
          </a>
        </div>
      </div>
      {isOpen && episodeId && (
        <div className="spotify-embed-panel" id={embedId}>
          <iframe
            src={`https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator&theme=0`}
            title={`Reproductor de Spotify: Ep. ${episode.number}: ${episode.name}`}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        </div>
      )}
    </>
  );
}
