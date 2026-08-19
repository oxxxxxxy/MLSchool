import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';

export const TwoLinesIntersectionLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k1, setK1] = useState<number>(1.0);
  const [b1, setB1] = useState<number>(2.0);
  const [k2, setK2] = useState<number>(-1.0);
  const [b2, setB2] = useState<number>(-2.0);

  const isParallel = Math.abs(k1 - k2) < 0.001;
  // Intersection: k1*x + b1 = k2*x + b2 => (k1 - k2)*x = b2 - b1 => x = (b2 - b1) / (k1 - k2)
  const intersectX = !isParallel ? (b2 - b1) / (k1 - k2) : 0;
  const intersectY = !isParallel ? k1 * intersectX + b1 : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 25;
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

    const drawLine = (k: number, b: number, color: string, glowColor: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      const xMin = -8;
      const xMax = 8;
      ctx.moveTo(centerX + xMin * scale, centerY - (k * xMin + b) * scale);
      ctx.lineTo(centerX + xMax * scale, centerY - (k * xMax + b) * scale);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    // Line 1 (Cyan)
    drawLine(k1, b1, '#06b6d4', '#0891b2');

    // Line 2 (Purple)
    drawLine(k2, b2, '#c084fc', '#9333ea');

    // Intersection Point
    if (!isParallel) {
      const px = centerX + intersectX * scale;
      const py = centerY - intersectY * scale;

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`Точка (${intersectX.toFixed(1)}, ${intersectY.toFixed(1)})`, px + 10, py - 8);
    }

  }, [k1, b1, k2, b2, isParallel, intersectX, intersectY]);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
            Интерактивный эксперимент 3
          </span>
          <h3 className="text-lg font-bold text-white">Две Прямые: Пересечение и Параллельность</h3>
        </div>

        <div className="text-xs font-bold">
          {isParallel ? (
            <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ⚡ Прямые параллельны (k₁ = k₂) — нет пересечений!
            </span>
          ) : (
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              🎯 Точка встречи: ({intersectX.toFixed(1)}, {intersectY.toFixed(1)})
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-inner">
          <canvas ref={canvasRef} width={460} height={300} className="w-full max-w-[460px] h-[300px] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          {/* Line 1 controls */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
            <span className="text-xs font-bold text-cyan-300 block">
              Прямая 1: y₁ = {k1.toFixed(1)}x + {b1.toFixed(1)}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block">Наклон k₁:</span>
                <input type="range" min="-3" max="3" step="0.5" value={k1} onChange={e => setK1(parseFloat(e.target.value))} className="w-full accent-cyan-500" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Сдвиг b₁:</span>
                <input type="range" min="-4" max="4" step="0.5" value={b1} onChange={e => setB1(parseFloat(e.target.value))} className="w-full accent-cyan-500" />
              </div>
            </div>
          </div>

          {/* Line 2 controls */}
          <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
            <span className="text-xs font-bold text-purple-300 block">
              Прямая 2: y₂ = {k2.toFixed(1)}x + {b2.toFixed(1)}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block">Наклон k₂:</span>
                <input type="range" min="-3" max="3" step="0.5" value={k2} onChange={e => setK2(parseFloat(e.target.value))} className="w-full accent-purple-500" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Сдвиг b₂:</span>
                <input type="range" min="-4" max="4" step="0.5" value={b2} onChange={e => setB2(parseFloat(e.target.value))} className="w-full accent-purple-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
