import React, { useState, useEffect, useRef } from 'react';
import { MathText } from '../../math/MathText';

interface DataPoint {
  x: number;
  y: number;
}

const POINTS: DataPoint[] = [
  { x: -2, y: -3 },
  { x: -1, y: -1 },
  { x: 0, y: 1 },
  { x: 1, y: 3 },
  { x: 2, y: 5 }
];

export const TwoWorldsSplitScreen: React.FC = () => {
  const dataCanvasRef = useRef<HTMLCanvasElement>(null);
  const paramCanvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState<number>(1.2);
  const [b, setB] = useState<number>(-0.5);

  // Compute MSE
  const mse = POINTS.reduce((acc, pt) => {
    const yHat = k * pt.x + b;
    const e = yHat - pt.y;
    return acc + e * e;
  }, 0) / POINTS.length;

  const isTrained = mse < 0.2;

  // Render Data World (Left Canvas)
  useEffect(() => {
    const canvas = dataCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 24;
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

    // Model line ŷ = kx + b
    ctx.strokeStyle = isTrained ? '#3fb950' : '#58a6ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const xMin = -centerX / scale;
    const xMax = (width - centerX) / scale;
    ctx.moveTo(centerX + xMin * scale, centerY - (k * xMin + b) * scale);
    ctx.lineTo(centerX + xMax * scale, centerY - (k * xMax + b) * scale);
    ctx.stroke();

    // Data points & error lines
    POINTS.forEach(pt => {
      const px = centerX + pt.x * scale;
      const py = centerY - pt.y * scale;
      const linePy = centerY - (k * pt.x + b) * scale;

      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, linePy);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f0f6fc';
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

  }, [k, b, isTrained]);

  // Render Parameter World (Right Canvas: Axis k vs Axis b)
  useEffect(() => {
    const canvas = paramCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 24;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Draw Heatmap / Concentric Rings of Loss centered at true (k=2, b=1)
    const trueK = 2.0;
    const trueB = 1.0;
    const truePx = centerX + trueK * scale;
    const truePy = centerY - trueB * scale;

    for (let r = 5; r >= 1; r--) {
      ctx.fillStyle = `rgba(88, 166, 255, ${0.05 * (6 - r)})`;
      ctx.beginPath();
      ctx.arc(truePx, truePy, r * 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#30363d';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Axes for (k, b)
    ctx.strokeStyle = '#484f58';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height);
    ctx.stroke();

    ctx.fillStyle = '#8b949e';
    ctx.font = '10px monospace';
    ctx.fillText('Параметр k', width - 68, centerY - 6);
    ctx.fillText('Параметр b', centerX + 6, 14);

    // Minimum target star
    ctx.fillStyle = '#3fb950';
    ctx.beginPath();
    ctx.arc(truePx, truePy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('Минимум Loss (2, 1)', truePx + 8, truePy + 4);

    // Current Parameter Marker (k, b)
    const curPx = centerX + k * scale;
    const curPy = centerY - b * scale;

    ctx.fillStyle = '#d29922';
    ctx.beginPath();
    ctx.arc(curPx, curPy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#d29922';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`(${k.toFixed(1)}, ${b.toFixed(1)})`, curPx + 10, curPy - 4);

  }, [k, b]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Главный интерактив: Два Мира</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Мир данных (x, y) слева ➔ Мир параметров (k, b) справа</h3>
        </div>
        <span className={`text-xs font-mono font-bold px-3 py-1 rounded border ${
          isTrained ? 'bg-[#238636]/20 border-[#2ea043] text-[#3fb950]' : 'bg-[#da3633]/20 border-[#f85149] text-[#f85149]'
        }`}>
          Loss (MSE) = {mse.toFixed(2)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Data World */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#58a6ff] font-bold block">1. Мир Данных: Точки и Прямая</span>
          <div className="relative rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117]">
            <canvas ref={dataCanvasRef} width={360} height={240} className="w-full h-auto aspect-[3/2] block" />
          </div>
        </div>

        {/* Right: Parameter World */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#d29922] font-bold block">2. Мир Параметров: Карта потерь L(k, b)</span>
          <div className="relative rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117]">
            <canvas ref={paramCanvasRef} width={360} height={240} className="w-full h-auto aspect-[3/2] block" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#8b949e]">Параметр k (наклон):</span>
            <span className="text-[#58a6ff] font-bold">{k.toFixed(1)}</span>
          </div>
          <input type="range" min="-1.0" max="4.0" step="0.1" value={k} onChange={e => setK(parseFloat(e.target.value))} className="w-full accent-[#58a6ff] cursor-pointer" />
        </div>

        <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#8b949e]">Параметр b (сдвиг):</span>
            <span className="text-[#d29922] font-bold">{b.toFixed(1)}</span>
          </div>
          <input type="range" min="-3.0" max="4.0" step="0.2" value={b} onChange={e => setB(parseFloat(e.target.value))} className="w-full accent-[#d29922] cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
