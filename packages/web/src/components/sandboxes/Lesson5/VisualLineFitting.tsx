import React, { useState, useEffect, useRef } from 'react';
import { MathText } from '../../math/MathText';

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

export const VisualLineFitting: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState<number>(0.5);
  const [b, setB] = useState<number>(-0.5);

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

    // Model Line ŷ = kx + b
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const xMin = -centerX / scale;
    const xMax = (width - centerX) / scale;
    ctx.moveTo(centerX + xMin * scale, centerY - (k * xMin + b) * scale);
    ctx.lineTo(centerX + xMax * scale, centerY - (k * xMax + b) * scale);
    ctx.stroke();

    // Points & Vertical Error Sticks (Without numerical total score)
    POINTS.forEach(pt => {
      const ptPx = centerX + pt.x * scale;
      const ptPy = centerY - pt.y * scale;
      const lineY = k * pt.x + b;
      const linePy = centerY - lineY * scale;

      // Vertical residual stick
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(ptPx, ptPy);
      ctx.lineTo(ptPx, linePy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point
      ctx.fillStyle = '#f0f6fc';
      ctx.beginPath();
      ctx.arc(ptPx, ptPy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

  }, [k, b]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Визуальный подбор модели</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Подбери прямую на глаз через облако точек</h3>
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
              <span className="text-[#58a6ff] font-bold">{k.toFixed(1)}</span>
            </div>
            <input type="range" min="-1.5" max="2.5" step="0.1" value={k} onChange={e => setK(parseFloat(e.target.value))} className="w-full accent-[#58a6ff] cursor-pointer" />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Сдвиг прямой (b):</span>
              <span className="text-[#d29922] font-bold">{b.toFixed(1)}</span>
            </div>
            <input type="range" min="-3.0" max="3.0" step="0.2" value={b} onChange={e => setB(parseFloat(e.target.value))} className="w-full accent-[#d29922] cursor-pointer" />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border-l-2 border-[#d29922] text-xs text-[#8b949e] leading-relaxed">
            Мы видим глазами, что одна линия выглядит лучше другой. Но компьютеру недостаточно слова «выглядит» — ему нужно точное математическое число ошибки!
          </div>
        </div>
      </div>
    </div>
  );
};
