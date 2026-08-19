import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const TwoLinesIntersectionLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k1, setK1] = useState<number>(1.0);
  const [b1, setB1] = useState<number>(2.0);
  const [k2, setK2] = useState<number>(-1.0);
  const [b2, setB2] = useState<number>(-2.0);

  const isParallel = Math.abs(k1 - k2) < 0.001;
  const intersectX = !isParallel ? (b2 - b1) / (k1 - k2) : 0;
  const intersectY = !isParallel ? k1 * intersectX + b1 : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 24;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#21262d';
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

    ctx.strokeStyle = '#484f58';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    const drawLine = (k: number, b: number, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const xMin = -8;
      const xMax = 8;
      ctx.moveTo(centerX + xMin * scale, centerY - (k * xMin + b) * scale);
      ctx.lineTo(centerX + xMax * scale, centerY - (k * xMax + b) * scale);
      ctx.stroke();
    };

    // Line 1 (Blue)
    drawLine(k1, b1, '#58a6ff');
    // Line 2 (Purple)
    drawLine(k2, b2, '#bc8cff');

    if (!isParallel) {
      const px = centerX + intersectX * scale;
      const py = centerY - intersectY * scale;

      ctx.fillStyle = '#d29922';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

  }, [k1, b1, k2, b2, isParallel, intersectX, intersectY]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Эксперимент 3
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Две прямые: Пересечение и параллельность</h3>
        </div>
        <span className="text-xs font-mono text-[#8b949e]">
          {isParallel ? 'Параллельны (k₁ = k₂)' : `Точка: (${intersectX.toFixed(1)}, ${intersectY.toFixed(1)})`}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[460px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={460} height={260} className="w-full h-auto aspect-[4/3] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-2">
            <span className="text-xs font-mono text-[#58a6ff] block">Прямая 1: y = {k1.toFixed(1)}x + {b1.toFixed(1)}</span>
            <div className="grid grid-cols-2 gap-2">
              <input type="range" min="-3" max="3" step="0.5" value={k1} onChange={e => setK1(parseFloat(e.target.value))} className="accent-[#58a6ff]" />
              <input type="range" min="-4" max="4" step="0.5" value={b1} onChange={e => setB1(parseFloat(e.target.value))} className="accent-[#58a6ff]" />
            </div>
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-2">
            <span className="text-xs font-mono text-[#bc8cff] block">Прямая 2: y = {k2.toFixed(1)}x + {b2.toFixed(1)}</span>
            <div className="grid grid-cols-2 gap-2">
              <input type="range" min="-3" max="3" step="0.5" value={k2} onChange={e => setK2(parseFloat(e.target.value))} className="accent-[#bc8cff]" />
              <input type="range" min="-4" max="4" step="0.5" value={b2} onChange={e => setB2(parseFloat(e.target.value))} className="accent-[#bc8cff]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
