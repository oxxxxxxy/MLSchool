import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';

export const SecantToTangentVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [x0, setX0] = useState<number>(1.0);
  const [deltaX, setDeltaX] = useState<number>(2.0);

  // Parabola f(x) = 0.5 * x^2 => f'(x) = x
  const fn = (x: number) => 0.5 * x * x;
  const trueDerivative = x0; // for 0.5 * x^2, derivative is x0

  const y0 = fn(x0);
  const x1 = x0 + deltaX;
  const y1 = fn(x1);
  const secantSlope = (y1 - y0) / deltaX;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 35;
    const centerX = width / 2 - 40;
    const centerY = height / 2 + 50;

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

    // Parabola curve
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const mx = (px - centerX) / scale;
      const my = fn(mx);
      const py = centerY - my * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // True Tangent Line (Gold dashed)
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const tanMinX = x0 - 3;
    const tanMaxX = x0 + 3;
    ctx.moveTo(centerX + tanMinX * scale, centerY - (y0 + trueDerivative * (tanMinX - x0)) * scale);
    ctx.lineTo(centerX + tanMaxX * scale, centerY - (y0 + trueDerivative * (tanMaxX - x0)) * scale);
    ctx.stroke();
    ctx.setLineDash([]);

    // Secant Line (Cyan Solid)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#0891b2';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    const secMinX = x0 - 2;
    const secMaxX = x1 + 2;
    ctx.moveTo(centerX + secMinX * scale, centerY - (y0 + secantSlope * (secMinX - x0)) * scale);
    ctx.lineTo(centerX + secMaxX * scale, centerY - (y0 + secantSlope * (secMaxX - x0)) * scale);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Point A (x0, y0)
    const pAx = centerX + x0 * scale;
    const pAy = centerY - y0 * scale;
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(pAx, pAy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Point B (x0 + deltaX, y1)
    const pBx = centerX + x1 * scale;
    const pBy = centerY - y1 * scale;
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(pBx, pBy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

  }, [x0, deltaX, secantSlope, trueDerivative]);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div>
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          Интерактивный эксперимент 1
        </span>
        <h3 className="text-lg font-bold text-white">От Секущей к Касательной: Стягивание Δx → 0</h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-inner">
          <canvas ref={canvasRef} width={460} height={300} className="w-full max-w-[460px] h-[300px] block" />
        </div>

        <div className="flex-1 w-full space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-cyan-300">Расстояние между точками Δx:</span>
              <span className="text-cyan-400 font-mono">{deltaX.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="3.0"
              step="0.05"
              value={deltaX}
              onChange={(e) => setDeltaX(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span className="text-emerald-400 font-bold">0.01 (Касательная!)</span>
              <span>1.5</span>
              <span>3.0 (Далекая секущая)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-center">
              <span className="text-[10px] uppercase font-bold text-cyan-400 block">Наклон секущей</span>
              <span className="text-lg font-black text-cyan-300 font-mono">{secantSlope.toFixed(2)}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Точная производная f'(x)</span>
              <span className="text-lg font-black text-amber-400 font-mono">{trueDerivative.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
