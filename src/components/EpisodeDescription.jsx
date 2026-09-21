import { Fragment } from 'react';

export default function EpisodeDescription({ episode }) {
  return episode.desc.split('\n').map((line, index) => (
    <Fragment key={index}>
      {index > 0 && '\n'}
      {episode.number === '10' && index === 1
        ? <span className="episode-credential">{line}</span>
        : line}
    </Fragment>
  ));
}
