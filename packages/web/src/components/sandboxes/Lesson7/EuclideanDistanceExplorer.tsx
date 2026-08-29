import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

interface Pt {
  x: number;
  y: number;
  label: string;
}

export const EuclideanDistanceExplorer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pt1, setPt1] = useState<Pt>({ x: -2, y: -1, label: 'Объект 1' });
  const [pt2, setPt2] = useState<Pt>({ x: 2, y: 2, label: 'Объект 2' });
  const [dragged, setDragged] = useState<'1' | '2' | null>(null);

  const dx = pt2.x - pt1.x;
  const dy = pt2.y - pt1.y;
  const dist = Math.hypot(dx, dy);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 28;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    for (let x = centerX; x <= width; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let x = centerX; x >= 0; x -= scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = centerY; y <= height; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
    for (let y = centerY; y >= 0; y -= scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#484f58';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height);
    ctx.stroke();

    const p1x = centerX + pt1.x * scale;
    const p1y = centerY - pt1.y * scale;
    const p2x = centerX + pt2.x * scale;
    const p2y = centerY - pt2.y * scale;

    // Euclidean distance line (Hypotenuse)
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.stroke();

    // Triangle Δx, Δy
    ctx.strokeStyle = '#d29922';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#d29922';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`Δx = ${Math.abs(dx)}`, (p1x + p2x) / 2 - 10, p1y + (dy >= 0 ? 14 : -6));
    ctx.fillText(`Δy = ${Math.abs(dy)}`, p2x + 6, (p1y + p2y) / 2);

    // Points
    [pt1, pt2].forEach(p => {
      const px = centerX + p.x * scale;
      const py = centerY - p.y * scale;
      ctx.fillStyle = '#3fb950';
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#f0f6fc';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`${p.label} (${p.x}, ${p.y})`, px + 10, py - 6);
    });

  }, [pt1, pt2, dx, dy]);

  const handlePointerDown = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (clientY - rect.top) * (canvas.height / rect.height);
    const scale = 28;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const p1x = centerX + pt1.x * scale;
    const p1y = centerY - pt1.y * scale;
    const p2x = centerX + pt2.x * scale;
    const p2y = centerY - pt2.y * scale;

    if (Math.hypot(clickX - p1x, clickY - p1y) < 20) setDragged('1');
    else if (Math.hypot(clickX - p2x, clickY - p2y) < 20) setDragged('2');
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!dragged) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (clientY - rect.top) * (canvas.height / rect.height);
    const scale = 28;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const mathX = Math.round((clickX - centerX) / scale);
    const mathY = Math.round((centerY - clickY) / scale);

    if (dragged === '1') setPt1(prev => ({ ...prev, x: mathX, y: mathY }));
    else if (dragged === '2') setPt2(prev => ({ ...prev, x: mathX, y: mathY }));
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Геометрия сходства</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Евклидово расстояние между объектами</h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#58a6ff] bg-[#0d1117] px-3 py-1 rounded border border-[#30363d]">
          d = {dist.toFixed(2)}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0 cursor-grab active:cursor-grabbing touch-none">
          <canvas
            ref={canvasRef}
            width={480}
            height={320}
            onMouseDown={e => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={e => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={() => setDragged(null)}
            onMouseLeave={() => setDragged(null)}
            onTouchStart={e => e.touches.length === 1 && handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={e => e.touches.length === 1 && handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={() => setDragged(null)}
            className="w-full h-auto aspect-[3/2] block"
          />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#8b949e]">Разница по признаку 1 (Δx):</span>
              <span className="text-[#d29922] font-bold">{Math.abs(dx)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8b949e]">Разница по признаку 2 (Δy):</span>
              <span className="text-[#d29922] font-bold">{Math.abs(dy)}</span>
            </div>
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] text-center font-mono text-xs">
            <FormulaView latex={`d = \\sqrt{\\Delta x^2 + \\Delta y^2} = \\sqrt{${dx}^2 + ${dy}^2} = ${dist.toFixed(2)}`} displayMode={true} />
          </div>

          <p className="text-xs text-[#8b949e] leading-relaxed">
            Чем меньше расстояние $d$ между двумя точками на плоскости признаков, тем более похожими алгоритм считает эти объекты.
          </p>
        </div>
      </div>
    </div>
  );
};
