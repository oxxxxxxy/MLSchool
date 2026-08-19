import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';

export const ParabolaLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [a, setA] = useState<number>(0.8);
  const [b, setB] = useState<number>(0.0);
  const [c, setC] = useState<number>(-3.0);

  const vertexX = a !== 0 ? -b / (2 * a) : 0;
  const vertexY = a * vertexX * vertexX + b * vertexX + c;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 25;
    const centerX = width / 2;
    const centerY = height / 2 + 30;

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

    // Parabola Curve
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#059669';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const mathX = (px - centerX) / scale;
      const mathY = a * mathX * mathX + b * mathX + c;
      const py = centerY - mathY * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Vertex Point
    const vPx = centerX + vertexX * scale;
    const vPy = centerY - vertexY * scale;

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(vPx, vPy, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label vertex
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`Вершина (${vertexX.toFixed(1)}, ${vertexY.toFixed(1)})`, vPx + 10, vPy - 8);

  }, [a, b, c, vertexX, vertexY]);

  const formulaLatex = `y = ${a.toFixed(1)}x^2 ${b >= 0 ? '+ ' + b.toFixed(1) + 'x' : '- ' + Math.abs(b).toFixed(1) + 'x'} ${c >= 0 ? '+ ' + c.toFixed(1) : '- ' + Math.abs(c).toFixed(1)}`;

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Интерактивный эксперимент 1
          </span>
          <h3 className="text-lg font-bold text-white">Анатомия Параболы: Чаши и Купола</h3>
        </div>

        <div className="text-2xl">
          {a > 0 ? '🥣 Чаша (Минимум)' : a < 0 ? '☂️ Купол (Максимум)' : '📏 Прямая'}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-inner">
          <canvas ref={canvasRef} width={460} height={300} className="w-full max-w-[460px] h-[300px] block" />
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30 text-xs font-bold text-emerald-300">
            <FormulaView latex={formulaLatex} />
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          {/* Slider a */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-300">Коэффициент a (Форма чаши):</span>
              <span className="text-emerald-400 font-mono">{a.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Slider b */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-sky-300">Сдвиг b:</span>
              <span className="text-sky-400 font-mono">{b.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.2"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Slider c */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-amber-300">Высота c:</span>
              <span className="text-amber-400 font-mono">{c.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              step="0.5"
              value={c}
              onChange={(e) => setC(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
