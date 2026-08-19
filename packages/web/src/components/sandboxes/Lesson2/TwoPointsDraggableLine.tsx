import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const TwoPointsDraggableLine: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pA, setPA] = useState<{ x: number; y: number }>({ x: -2, y: -1 });
  const [pB, setPB] = useState<{ x: number; y: number }>({ x: 3, y: 4 });
  const [dragging, setDragging] = useState<'A' | 'B' | null>(null);

  const dx = pB.x - pA.x;
  const dy = pB.y - pA.y;
  const isVertical = Math.abs(dx) < 0.001;
  const k = !isVertical ? dy / dx : 0;
  const b = !isVertical ? pA.y - k * pA.x : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 26;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#484f58';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Line through two points
    if (!isVertical) {
      ctx.strokeStyle = '#3fb950';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const xMin = -8;
      const xMax = 8;
      ctx.moveTo(centerX + xMin * scale, centerY - (k * xMin + b) * scale);
      ctx.lineTo(centerX + xMax * scale, centerY - (k * xMax + b) * scale);
      ctx.stroke();
    }

    // Point A (Red)
    const pAx = centerX + pA.x * scale;
    const pAy = centerY - pA.y * scale;
    ctx.fillStyle = '#f85149';
    ctx.beginPath();
    ctx.arc(pAx, pAy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#f85149';
    ctx.font = '10px monospace';
    ctx.fillText(`A(${pA.x.toFixed(1)}, ${pA.y.toFixed(1)})`, pAx + 8, pAy - 6);

    // Point B (Blue)
    const pBx = centerX + pB.x * scale;
    const pBy = centerY - pB.y * scale;
    ctx.fillStyle = '#58a6ff';
    ctx.beginPath();
    ctx.arc(pBx, pBy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#58a6ff';
    ctx.font = '10px monospace';
    ctx.fillText(`B(${pB.x.toFixed(1)}, ${pB.y.toFixed(1)})`, pBx + 8, pBy - 6);

  }, [pA, pB, k, b, isVertical]);

  const updateDrag = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (clientY - rect.top) * (canvas.height / rect.height);

    const scale = 26;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const mathX = Math.round(((clickX - centerX) / scale) * 2) / 2;
    const mathY = Math.round(((centerY - clickY) / scale) * 2) / 2;

    if (dragging === 'A') setPA({ x: mathX, y: mathY });
    else if (dragging === 'B') setPB({ x: mathX, y: mathY });
  };

  const startDrag = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (clientY - rect.top) * (canvas.height / rect.height);

    const scale = 26;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const pAx = centerX + pA.x * scale;
    const pAy = centerY - pA.y * scale;
    const pBx = centerX + pB.x * scale;
    const pBy = centerY - pB.y * scale;

    const distA = Math.hypot(clickX - pAx, clickY - pAy);
    const distB = Math.hypot(clickX - pBx, clickY - pBy);

    if (distA < 22) setDragging('A');
    else if (distB < 22) setDragging('B');
  };

  const formulaStr = !isVertical
    ? `y = ${k.toFixed(2)}x ${b >= 0 ? '+ ' + b.toFixed(2) : '- ' + Math.abs(b).toFixed(2)}`
    : 'x = \\text{const}';

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div>
        <span className="text-[11px] font-mono text-[#8b949e] uppercase">
          Эксперимент 4
        </span>
        <h3 className="text-sm font-semibold text-[#c9d1d9]">Прямая через две точки</h3>
        <p className="text-xs text-[#8b949e] mt-0.5">
          Зажми и перетаскивай точки A и B пальцем или мышкой прямо по холсту
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[460px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0 cursor-grab active:cursor-grabbing touch-none">
          <canvas
            ref={canvasRef}
            width={460}
            height={280}
            onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
            onMouseMove={(e) => dragging && updateDrag(e.clientX, e.clientY)}
            onMouseUp={() => setDragging(null)}
            onMouseLeave={() => setDragging(null)}
            onTouchStart={(e) => e.touches.length === 1 && startDrag(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => dragging && e.touches.length === 1 && updateDrag(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={() => setDragging(null)}
            className="w-full h-auto aspect-[4/3] block"
          />
          <div className="absolute top-2.5 left-2.5 bg-[#161b22]/90 backdrop-blur-md px-2 py-1 rounded border border-[#30363d] text-xs font-mono text-[#3fb950]">
            <FormulaView latex={formulaStr} />
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] text-xs space-y-1">
            <span className="font-mono text-[#8b949e] block">Расчет наклона k:</span>
            <div className="font-mono text-[#f0f6fc] text-xs overflow-x-auto py-1">
              <FormulaView latex={`k = \\frac{${pB.y.toFixed(1)} - (${pA.y.toFixed(1)})}{${pB.x.toFixed(1)} - (${pA.x.toFixed(1)})} = ${k.toFixed(2)}`} displayMode={true} />
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] text-xs text-[#8b949e] leading-relaxed">
            <MathText text="Через любые две точки на плоскости можно провести ровно одну прямую линию!" />
          </div>
        </div>
      </div>
    </div>
  );
};
