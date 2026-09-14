import { useId } from 'react';
import './MindTree.css';

export const disciplines = [
  { name: 'Ciencia', color: '#91dfce', region: '0,0 400,0 400,470 300,380 0,335', path: 'M400 400 Q170 300 170 180 T270 0', side: 'left', top: '1%' },
  { name: 'Tecnología', color: '#a4afff', region: '400,0 800,0 800,335 500,380 400,470', path: 'M400 400 Q630 300 630 180 T530 0', side: 'right', top: '1%' },
  { name: 'Arte', color: '#e3a5ce', region: '0,335 300,335 400,470 400,580 0,580', path: 'M400 480 Q220 370 100 460 L0 470', side: 'left', top: '55%' },
  { name: 'Humanidades', color: '#e7ce99', region: '500,335 800,335 800,580 400,580 400,470', path: 'M400 480 Q580 370 700 460 L800 470', side: 'right', top: '55%' },
];

export default function MindTree() {
  const id = useId().replaceAll(':', '');
  return (
    <div className="mind-tree">
      <div className="mind-tree-art">
        <svg className="mind-tree-painting" viewBox="0 0 800 1000" aria-hidden="true">
          <defs>
            <image id={`${id}-art`} href="/assets/img/arbol-mente.webp" width="800" height="1000" />
            <filter id={`${id}-soft-edge`} filterUnits="userSpaceOnUse" x="0" y="0" width="800" height="1000"><feGaussianBlur stdDeviation="9" /></filter>
            <mask id={`${id}-growth`} maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="1000">
              <g fill="none" stroke="white" strokeLinecap="round" strokeDasharray="1" filter={`url(#${id}-soft-edge)`}>
                <path d="M400 1250 L400 1050" pathLength="1" strokeWidth="800" style={{ strokeDashoffset: 'calc(1 - var(--tree-roots, 0))', opacity: 'var(--tree-roots, 0)' }} />
                <path d="M400 790 C290 650 510 570 400 350" pathLength="1" strokeWidth="180" style={{ strokeDashoffset: 'calc(1 - var(--tree-trunk, 0))', opacity: 'var(--tree-trunk, 0)' }} />
              </g>
              {disciplines.map((discipline, index) => (
                <g key={discipline.name} filter={`url(#${id}-soft-edge)`}>
                  <g clipPath={`url(#${id}-region-${index})`}>
                  <path d={discipline.path} fill="none" stroke="white" strokeWidth="420" strokeLinecap="round" pathLength="1" strokeDasharray="1" style={{ strokeDashoffset: `calc(1 - var(--branch-${index}, 0))`, opacity: `var(--branch-${index}, 0)` }} />
                  </g>
                </g>
              ))}
              <rect width="800" height="1000" fill="white" style={{ opacity: 'var(--tree-complete, 0)' }} />
            </mask>
            {disciplines.map((discipline, index) => <clipPath key={discipline.name} id={`${id}-region-${index}`}><polygon points={discipline.region} /></clipPath>)}
            {disciplines.map((discipline, index) => {
              const rgb = discipline.color.match(/\w\w/g).map(hex => parseInt(hex, 16) / 255);
              const matrix = rgb.map(channel => `${channel * 0.2126} ${channel * 0.7152} ${channel * 0.0722} 0 0`).join(' ');
              return <filter key={discipline.name} id={`${id}-tint-${index}`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={`${matrix} 0 0 0 1 0`} /></filter>;
            })}
          </defs>
          <g mask={`url(#${id}-growth)`}>
            <use href={`#${id}-art`} />
            {disciplines.map((discipline, index) => (
              <g key={discipline.name} clipPath={`url(#${id}-region-${index})`} style={{ mixBlendMode: 'screen', opacity: `var(--pulse-${index}, 0)` }}>
                <use href={`#${id}-art`} filter={`url(#${id}-tint-${index})`} />
              </g>
            ))}
          </g>
        </svg>
        <svg className="mind-tree-wave" viewBox="0 0 400 64" aria-hidden="true">
          <path d="M0 32 H65 Q75 32 80 25 L87 42 L97 12 L108 53 L120 6 L133 57 L146 20 L157 40 Q166 32 177 32 H220 Q230 32 235 20 L245 48 L256 10 L270 54 L283 19 L292 37 Q300 32 310 32 H400" />
        </svg>
        <ul className="mind-tree-disciplines" aria-label="Disciplinas del podcast">
          {disciplines.map((discipline, index) => (
            <li key={discipline.name} className={`mind-tree-label ${discipline.side}`} style={{
              '--discipline-color': discipline.color, '--label-opacity': `var(--label-${index}, 0)`,
              '--label-travel': `var(--travel-${index}, 1)`, '--label-pulse': `var(--pulse-${index}, 0)`, top: discipline.top,
            }}>{discipline.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
