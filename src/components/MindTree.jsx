import { useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { createTreeRenderer, disciplines } from './treeGrowth';
import './MindTree.css';

export { disciplines };

export default function MindTree({ ref }) {
  const canvasRef = useRef(null);
  const renderRef = useRef(null);
  const progressRef = useRef(0);
  useImperativeHandle(ref, () => ({
    draw(progress) {
      if (progressRef.current === progress) return;
      progressRef.current = progress;
      renderRef.current?.(progress);
    },
  }), []);
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      renderRef.current = createTreeRenderer(canvas);
      renderRef.current(progressRef.current);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    return () => { observer.disconnect(); renderRef.current = null; };
  }, []);
  return (
    <div className="mind-tree">
      <div className="mind-tree-art">
        <canvas ref={canvasRef} className="mind-tree-painting" width="800" height="1000" aria-hidden="true" />
        <ul className="mind-tree-disciplines" aria-label="Disciplinas del podcast">
          {disciplines.map((discipline, index) => (
            <li key={discipline.name} className={`mind-tree-label ${discipline.side}`} style={{
              '--discipline-color': discipline.color, '--label-opacity': `var(--label-${index}, 0)`, top: discipline.top,
            }}>{discipline.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
