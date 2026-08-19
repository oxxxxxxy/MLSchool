import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';

export const DerivativeMicroscope: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lensX, setLensX] = useState<number>(1.2);

  // Curve: f(x) = sin(x) + 0.3*x
  const fn = (x: number) => Math.sin(x) + 0.3 * x;
  // Derivative f'(x) = cos(x) + 0.3
  const slope = Math.cos(lensX) + 0.3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 30;
    const centerX = width / 2 - 30;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Main wavy curve
    ctx.strokeStyle = '#a855f7';
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

    // Lens Center
    const lensPx = centerX + lensX * scale;
    const lensPy = centerY - fn(lensX) * scale;

    // Magnifier Lens Circle
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.arc(lensPx, lensPy, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Local Tangent Stick inside Lens
    ctx.strokeStyle = slope > 0 ? '#10b981' : slope < 0 ? '#f43f5e' : '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    const stickLen = 35;
    const angle = Math.atan(slope);
    ctx.moveTo(lensPx - Math.cos(angle) * stickLen, lensPy + Math.sin(angle) * stickLen);
    ctx.lineTo(lensPx + Math.cos(angle) * stickLen, lensPy - Math.sin(angle) * stickLen);
    ctx.stroke();

    // Dot at center
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(lensPx, lensPy, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [lensX, slope]);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div>
        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
          Интерактивный эксперимент 2
        </span>
        <h3 className="text-lg font-bold text-white">Интерактивный Микроскоп Касательной</h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-inner">
          <canvas ref={canvasRef} width={460} height={280} className="w-full max-w-[460px] h-[280px] block" />
        </div>

        <div className="flex-1 w-full space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-purple-300">Положение лупы X:</span>
              <span className="text-purple-400 font-mono">{lensX.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.1"
              value={lensX}
              onChange={(e) => setLensX(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div className={`p-4 rounded-2xl border text-center transition-all ${
            slope > 0.1
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : slope < -0.1
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
          }`}>
            <span className="text-[10px] uppercase font-bold tracking-wider block">
              Наклон палочки в лупе = Производная f'(x)
            </span>
            <div className="text-2xl font-black font-mono mt-1">
              f'({lensX.toFixed(1)}) = {slope.toFixed(2)}
            </div>
            <span className="text-xs font-medium mt-1 block">
              {slope > 0.1 ? '🟢 Склон идет вверх (Подъем)' : slope < -0.1 ? '🔴 Склон идет вниз (Спуск)' : '🟡 Ровная площадка (Экстремум)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
