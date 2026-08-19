import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';

export const LiveCartesianTracer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [xVal, setXVal] = useState<number>(2);
  const [funcType, setFuncType] = useState<'linear' | 'quadratic' | 'cubic'>('quadratic');

  const evalFunc = (x: number): number => {
    switch (funcType) {
      case 'linear': return 1.5 * x;
      case 'quadratic': return 0.5 * x * x - 2;
      case 'cubic': return 0.1 * x * x * x;
      default: return x;
    }
  };

  const formulaStr = {
    linear: 'y = 1.5x',
    quadratic: 'y = 0.5x^2 - 2',
    cubic: 'y = 0.1x^3'
  }[funcType];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 25; // pixels per unit
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '11px sans-serif';
    ctx.fillText('X (Входы)', width - 60, centerY - 10);
    ctx.fillText('Y (Выходы)', centerX + 10, 20);

    // Full Function Curve (Ghost / Faint)
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const mathX = (px - centerX) / scale;
      const mathY = evalFunc(mathX);
      const py = centerY - mathY * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Traced Curve up to current X
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#6366f1';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    const currentPx = centerX + xVal * scale;
    const startPx = centerX - 6 * scale;
    for (let px = startPx; px <= currentPx; px += 2) {
      const mathX = (px - centerX) / scale;
      const mathY = evalFunc(mathX);
      const py = centerY - mathY * scale;
      if (px === startPx) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Current point
    const currentY = evalFunc(xVal);
    const pointPy = centerY - currentY * scale;

    // Projection dashed lines
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.5)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(currentPx, centerY);
    ctx.lineTo(currentPx, pointPy);
    ctx.lineTo(centerX, pointPy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glowing Dot
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(currentPx, pointPy, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

  }, [xVal, funcType]);

  const currentY = evalFunc(xVal);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Интерактивный эксперимент 2
          </span>
          <h3 className="text-lg font-bold text-white">Трассировщик Графика на Плоскости</h3>
        </div>

        <div className="flex gap-2">
          {(['linear', 'quadratic', 'cubic'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFuncType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                funcType === type
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {type === 'linear' ? 'Прямая' : type === 'quadratic' ? 'Парабола' : 'Кубическая'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Canvas */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-inner">
          <canvas
            ref={canvasRef}
            width={480}
            height={320}
            className="w-full max-w-[480px] h-[320px] block"
          />
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-bold text-indigo-300">
            <FormulaView latex={formulaStr} />
          </div>
        </div>

        {/* Controls and telemetry */}
        <div className="flex-1 w-full space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-400">Входной аргумент X:</span>
              <span className="text-amber-400 text-sm font-mono">{xVal.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={xVal}
              onChange={(e) => setXVal(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-center">
              <span className="text-[10px] uppercase font-bold text-indigo-400 block">Координата X</span>
              <span className="text-lg font-black text-white font-mono">{xVal.toFixed(1)}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Вычисленный Y</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{currentY.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            ✨ <strong>Магия координат:</strong> Точка $(x, y)$ двигается по плоскости. Непрерывное перемещение $x$ оставляет за собой сияющий след графика!
          </p>
        </div>
      </div>
    </div>
  );
};
