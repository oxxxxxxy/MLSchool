import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';

export const SlopeTriangleInspector: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState<number>(2.0);
  const [deltaX, setDeltaX] = useState<number>(2.0);

  const deltaY = k * deltaX;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 32;
    const centerX = width / 2 - 40;
    const centerY = height / 2 + 30;

    ctx.clearRect(0, 0, width, height);

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Line
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 4 * scale, centerY - (k * -4) * scale);
    ctx.lineTo(centerX + 6 * scale, centerY - (k * 6) * scale);
    ctx.stroke();

    // Right-angle Triangle Points
    const p1 = { x: 1, y: k * 1 };
    const p2 = { x: 1 + deltaX, y: k * 1 };
    const p3 = { x: 1 + deltaX, y: k * 1 + deltaY };

    const c1 = { px: centerX + p1.x * scale, py: centerY - p1.y * scale };
    const c2 = { px: centerX + p2.x * scale, py: centerY - p2.y * scale };
    const c3 = { px: centerX + p3.x * scale, py: centerY - p3.y * scale };

    // Fill triangle
    ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
    ctx.beginPath();
    ctx.moveTo(c1.px, c1.py);
    ctx.lineTo(c2.px, c2.py);
    ctx.lineTo(c3.px, c3.py);
    ctx.closePath();
    ctx.fill();

    // Horizontal Δx leg (Cyan)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(c1.px, c1.py);
    ctx.lineTo(c2.px, c2.py);
    ctx.stroke();

    // Vertical Δy leg (Rose)
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(c2.px, c2.py);
    ctx.lineTo(c3.px, c3.py);
    ctx.stroke();

    // Hypotenuse (Main Slope segment)
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(c1.px, c1.py);
    ctx.lineTo(c3.px, c3.py);
    ctx.stroke();

    // Labels on legs
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#06b6d4';
    ctx.fillText(`Δx = ${deltaX}`, (c1.px + c2.px) / 2 - 15, c1.py + 18);

    ctx.fillStyle = '#f43f5e';
    ctx.fillText(`Δy = ${deltaY.toFixed(1)}`, c2.px + 8, (c2.py + c3.py) / 2 + 4);

  }, [k, deltaX, deltaY]);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div>
        <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
          Интерактивный эксперимент 2
        </span>
        <h3 className="text-lg font-bold text-white">Треугольник Крутизны: Что такое Δy / Δx?</h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-inner">
          <canvas ref={canvasRef} width={460} height={280} className="w-full max-w-[460px] h-[280px] block" />
        </div>

        <div className="flex-1 w-full space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-indigo-300">Шаг по горизонтали (Δx):</span>
              <span className="text-cyan-400 font-mono text-sm">{deltaX.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={deltaX}
              onChange={(e) => setDeltaX(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
            <div className="text-xs font-bold text-slate-300">Формула наклона:</div>
            <div className="text-lg font-black text-white">
              <FormulaView latex={`k = \\frac{\\Delta y}{\\Delta x} = \\frac{${deltaY.toFixed(1)}}{${deltaX.toFixed(1)}} = ${k.toFixed(1)}`} displayMode={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
