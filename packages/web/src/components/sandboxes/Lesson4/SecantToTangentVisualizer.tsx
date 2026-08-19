import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const SecantToTangentVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [x0] = useState<number>(1.0);
  const [deltaX, setDeltaX] = useState<number>(2.0);

  const fn = (x: number) => 0.5 * x * x;
  const trueDerivative = x0;
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
    const scale = 32;
    const centerX = width / 2 - 30;
    const centerY = height / 2 + 40;

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

    // Parabola
    ctx.strokeStyle = '#8b949e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const mx = (px - centerX) / scale;
      const my = fn(mx);
      const py = centerY - my * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Tangent (Gold dashed)
    ctx.strokeStyle = '#d29922';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX - 3 * scale, centerY - (y0 + trueDerivative * -3) * scale);
    ctx.lineTo(centerX + 3 * scale, centerY - (y0 + trueDerivative * 3) * scale);
    ctx.stroke();
    ctx.setLineDash([]);

    // Secant (Blue)
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(centerX + (x0 - 2) * scale, centerY - (y0 + secantSlope * -2) * scale);
    ctx.lineTo(centerX + (x1 + 2) * scale, centerY - (y0 + secantSlope * (deltaX + 2)) * scale);
    ctx.stroke();

    // Points
    const pAx = centerX + x0 * scale;
    const pAy = centerY - y0 * scale;
    const pBx = centerX + x1 * scale;
    const pBy = centerY - y1 * scale;

    ctx.fillStyle = '#f85149';
    ctx.beginPath();
    ctx.arc(pAx, pAy, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#58a6ff';
    ctx.beginPath();
    ctx.arc(pBx, pBy, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [x0, deltaX, secantSlope, trueDerivative]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div>
        <span className="text-[11px] font-mono text-[#8b949e] uppercase">
          Эксперимент 1
        </span>
        <h3 className="text-sm font-semibold text-[#c9d1d9]">Стягивание секущей в касательную</h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[460px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={460} height={260} className="w-full h-auto aspect-[4/3] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Расстояние между точками (Δx):</span>
              <span className="text-[#58a6ff]">{deltaX.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="3.0"
              step="0.05"
              value={deltaX}
              onChange={(e) => setDeltaX(parseFloat(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-center">
            <div className="p-2 rounded bg-[#0d1117] border border-[#30363d]">
              <span className="text-[10px] text-[#8b949e] block">Наклон секущей</span>
              <span className="text-sm font-semibold text-[#58a6ff]">{secantSlope.toFixed(2)}</span>
            </div>
            <div className="p-2 rounded bg-[#0d1117] border border-[#30363d]">
              <span className="text-[10px] text-[#8b949e] block">Производная f'(x)</span>
              <span className="text-sm font-semibold text-[#d29922]">{trueDerivative.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
