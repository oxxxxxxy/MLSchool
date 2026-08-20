import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';
import confetti from 'canvas-confetti';

interface DataPoint {
  x: number;
  y: number;
}

const POINTS: DataPoint[] = [
  { x: -3, y: -2.5 },
  { x: -2, y: -1.2 },
  { x: -1, y: -0.2 },
  { x: 0, y: 0.8 },
  { x: 1, y: 1.5 },
  { x: 2, y: 2.7 },
  { x: 3, y: 3.2 }
];

export const BestFitLineGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState<number>(0.2);
  const [b, setB] = useState<number>(-1.0);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Compute Total Error (Sum of Absolute Residuals)
  const totalError = POINTS.reduce((acc, pt) => {
    const predictedY = k * pt.x + b;
    return acc + Math.abs(pt.y - predictedY);
  }, 0);

  const isOptimal = totalError < 2.2;

  useEffect(() => {
    if (isOptimal && !hasCelebrated) {
      setHasCelebrated(true);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    }
  }, [isOptimal, hasCelebrated]);

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

    // Symmetrical Grid
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

    // Regression Line
    ctx.strokeStyle = isOptimal ? '#3fb950' : '#58a6ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const xMin = -centerX / scale;
    const xMax = (width - centerX) / scale;
    ctx.moveTo(centerX + xMin * scale, centerY - (k * xMin + b) * scale);
    ctx.lineTo(centerX + xMax * scale, centerY - (k * xMax + b) * scale);
    ctx.stroke();

    // Data Points & Red Residual Error Sticks
    POINTS.forEach(pt => {
      const ptPx = centerX + pt.x * scale;
      const ptPy = centerY - pt.y * scale;
      const lineY = k * pt.x + b;
      const linePy = centerY - lineY * scale;

      // Residual stick
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(ptPx, ptPy);
      ctx.lineTo(ptPx, linePy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point Dot
      ctx.fillStyle = '#f0f6fc';
      ctx.beginPath();
      ctx.arc(ptPx, ptPy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

  }, [k, b, isOptimal]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Тренажер 2
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Подбор лучшей линии тренда через данные</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#8b949e]">Сумма ошибок:</span>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
            isOptimal ? 'bg-[#238636]/20 border-[#2ea043] text-[#3fb950]' : 'bg-[#da3633]/20 border-[#f85149] text-[#f85149]'
          }`}>
            {totalError.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto aspect-[3/2] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Наклон прямой (k):</span>
              <span className="text-[#58a6ff] font-semibold">{k.toFixed(1)}</span>
            </div>
            <input type="range" min="-1.5" max="2.5" step="0.1" value={k} onChange={e => setK(parseFloat(e.target.value))} className="w-full accent-[#58a6ff] cursor-pointer" />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Сдвиг прямой (b):</span>
              <span className="text-[#d29922] font-semibold">{b.toFixed(1)}</span>
            </div>
            <input type="range" min="-3.0" max="3.0" step="0.2" value={b} onChange={e => setB(parseFloat(e.target.value))} className="w-full accent-[#d29922] cursor-pointer" />
          </div>

          <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] text-xs text-[#8b949e] leading-relaxed">
            {isOptimal ? (
              <span className="text-[#3fb950] font-semibold font-mono">✨ Отлично! Линия проходит точно по центру облака точек с минимальной ошибкой.</span>
            ) : (
              <span>Крути $k$ и $b$, чтобы красные пунктирные отрезки ошибок стали как можно короче!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
