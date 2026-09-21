import { ChevronDown } from 'lucide-react';

export default function EpisodeNotes({ notes }) {
  const blocks = [];
  for (const line of notes.split(/\n|(?=•)/).map(line => line.trim()).filter(Boolean)) {
    if (line.startsWith('•')) {
      if (blocks.at(-1)?.type !== 'list') blocks.push({ type: 'list', items: [] });
      blocks.at(-1).items.push(line.slice(1).trim());
    } else {
      blocks.push({ type: 'paragraph', text: line });
    }
  }

  return (
    <details className="episodio-notas" open>
      <summary>Sobre este episodio<ChevronDown size={20} aria-hidden="true" /></summary>
      <div className="episodio-notas-cuerpo">
        {blocks.map((block, index) => block.type === 'list'
          ? <ul key={index}>{block.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
          : <p key={index}>{block.text}</p>)}
      </div>
    </details>
  );
}
