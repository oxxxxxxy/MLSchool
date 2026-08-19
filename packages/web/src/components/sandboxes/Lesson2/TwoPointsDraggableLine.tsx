import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';

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
    const scale = 28;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Line through two points
    if (!isVertical) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#059669';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      const xMin = -8;
      const xMax = 8;
      ctx.moveTo(centerX + xMin * scale, centerY - (k * xMin + b) * scale);
      ctx.lineTo(centerX + xMax * scale, centerY - (k * xMax + b) * scale);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw Point A (Rose)
    const pAx = centerX + pA.x * scale;
    const pAy = centerY - pA.y * scale;
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(pAx, pAy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`A (${pA.x.toFixed(1)}, ${pA.y.toFixed(1)})`, pAx + 10, pAy - 6);

    // Draw Point B (Sky)
    const pBx = centerX + pB.x * scale;
    const pBy = centerY - pB.y * scale;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(pBx, pBy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`B (${pB.x.toFixed(1)}, ${pB.y.toFixed(1)})`, pBx + 10, pBy - 6);

  }, [pA, pB, k, b, isVertical]);

  const updateDrag = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (clientY - rect.top) * (canvas.height / rect.height);

    const scale = 28;
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

    const scale = 28;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const pAx = centerX + pA.x * scale;
    const pAy = centerY - pA.y * scale;
    const pBx = centerX + pB.x * scale;
    const pBy = centerY - pB.y * scale;

    const distA = Math.hypot(clickX - pAx, clickY - pAy);
    const distB = Math.hypot(clickX - pBx, clickY - pBy);

    if (distA < 24) setDragging('A');
    else if (distB < 24) setDragging('B');
  };

  const formulaStr = !isVertical
    ? `y = ${k.toFixed(2)}x ${b >= 0 ? '+ ' + b.toFixed(2) : '- ' + Math.abs(b).toFixed(2)}`
    : 'x = const (Вертикаль)';

  return (
    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 space-y-4 sm:space-y-6 shadow-xl">
      <div>
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
          Интерактивный эксперимент 4
        </span>
        <h3 className="text-base sm:text-lg font-bold text-white">Потяни за точки: Прямая через две точки</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Зажми и перетаскивай точки A и B пальцем или мышкой прямо по холсту!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
        <div className="relative w-full max-w-[460px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-inner cursor-grab active:cursor-grabbing touch-none">
          <canvas
            ref={canvasRef}
            width={460}
            height={300}
            onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
            onMouseMove={(e) => dragging && updateDrag(e.clientX, e.clientY)}
            onMouseUp={() => setDragging(null)}
            onMouseLeave={() => setDragging(null)}
            onTouchStart={(e) => e.touches.length === 1 && startDrag(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => dragging && e.touches.length === 1 && updateDrag(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={() => setDragging(null)}
            className="w-full h-auto aspect-[4/3] block"
          />
          <div className="absolute top-2.5 left-2.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-mono font-bold text-emerald-300">
            <FormulaView latex={formulaStr} />
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
            <span className="font-bold text-slate-300 block">Расчет наклона k:</span>
            <div className="font-mono text-white text-xs sm:text-sm overflow-x-auto py-1">
              <FormulaView latex={`k = \\frac{${pB.y.toFixed(1)} - (${pA.y.toFixed(1)})}{${pB.x.toFixed(1)} - (${pA.x.toFixed(1)})} = ${k.toFixed(2)}`} displayMode={true} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            ✨ <strong>Аксиома геометрии:</strong> Через любые две точки на плоскости можно провести ровно одну прямую линию!
          </div>
        </div>
      </div>
    </div>
  );
};
