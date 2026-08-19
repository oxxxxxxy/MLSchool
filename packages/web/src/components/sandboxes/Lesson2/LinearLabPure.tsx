import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';

export const LinearLabPure: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState<number>(1.5);
  const [b, setB] = useState<number>(1.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 30; // 30 px = 1 unit
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear
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
    ctx.fillText('X', width - 20, centerY - 10);
    ctx.fillText('Y', centerX + 10, 20);

    // Main Line y = kx + b
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    const xMin = -centerX / scale;
    const xMax = (width - centerX) / scale;
    const yAtMin = k * xMin + b;
    const yAtMax = k * xMax + b;

    ctx.moveTo(centerX + xMin * scale, centerY - yAtMin * scale);
    ctx.lineTo(centerX + xMax * scale, centerY - yAtMax * scale);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Intercept Point (0, b)
    const interceptPy = centerY - b * scale;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(centerX, interceptPy, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`Старт (0, ${b.toFixed(1)})`, centerX + 12, interceptPy + 4);

  }, [k, b]);

  const formulaLatex = `y = ${k.toFixed(1)}x ${b >= 0 ? '+ ' + b.toFixed(1) : '- ' + Math.abs(b).toFixed(1)}`;

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Интерактивный эксперимент
          </span>
          <h3 className="text-lg font-bold text-white">Лаборатория Прямой Линии</h3>
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
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sky-500/30 text-xs font-bold text-sky-300">
            <FormulaView latex={formulaLatex} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 w-full space-y-4">
          {/* Slope k */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-sky-300">Наклон k (Крутизна горки):</span>
              <span className="text-sky-400 font-mono text-sm">{k.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.1"
              value={k}
              onChange={(e) => setK(parseFloat(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Спуск (-4)</span>
              <span>Плоско (0)</span>
              <span>Подъем (+4)</span>
            </div>
          </div>

          {/* Bias b */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-amber-300">Сдвиг b (Стартовая высота):</span>
              <span className="text-amber-400 font-mono text-sm">{b.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.2"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            💡 <strong>Попробуй:</strong> Сделай $k = 0$ — прямая станет идеально горизонтальной. Меняй $b$ — прямая параллельно скользит вверх и вниз.
          </div>
        </div>
      </div>
    </div>
  );
};
