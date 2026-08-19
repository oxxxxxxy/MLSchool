import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const SecantToTangentVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [x0, setX0] = useState<number>(1.0);
  const [deltaX, setDeltaX] = useState<number>(1.5);

  const fn = (x: number) => 0.4 * x * x;
  const trueDerivative = 0.8 * x0; // derivative of 0.4 x^2 is 0.8 x
  const y0 = fn(x0);
  const x1 = x0 + deltaX;
  const y1 = fn(x1);
  const secantSlope = (y1 - y0) / (deltaX || 0.0001);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 28;
    const centerX = width / 2;
    const centerY = height / 2 + 40;

    ctx.clearRect(0, 0, width, height);

    // Grid aligned strictly to origin (centerX, centerY)
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

    ctx.fillStyle = '#8b949e';
    ctx.font = '10px monospace';
    ctx.fillText('X', width - 14, centerY - 6);
    ctx.fillText('Y', centerX + 6, 14);

    // Parabola curve y = 0.4 x^2
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

    // Tangent line (Gold dashed): passes strictly through (x0, y0) with slope trueDerivative
    ctx.strokeStyle = '#d29922';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const xMin = -centerX / scale;
    const xMax = (width - centerX) / scale;
    // Equation: y = y0 + trueDerivative * (x - x0)
    const yTanAtMin = y0 + trueDerivative * (xMin - x0);
    const yTanAtMax = y0 + trueDerivative * (xMax - x0);
    ctx.moveTo(centerX + xMin * scale, centerY - yTanAtMin * scale);
    ctx.lineTo(centerX + xMax * scale, centerY - yTanAtMax * scale);
    ctx.stroke();
    ctx.setLineDash([]);

    // Secant line (Blue): passes strictly through (x0, y0) and (x1, y1)
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    // Equation: y = y0 + secantSlope * (x - x0)
    const ySecAtMin = y0 + secantSlope * (xMin - x0);
    const ySecAtMax = y0 + secantSlope * (xMax - x0);
    ctx.moveTo(centerX + xMin * scale, centerY - ySecAtMin * scale);
    ctx.lineTo(centerX + xMax * scale, centerY - ySecAtMax * scale);
    ctx.stroke();

    // Point 1 (Fixed Point x0, y0)
    const p0x = centerX + x0 * scale;
    const p0y = centerY - y0 * scale;
    ctx.fillStyle = '#f85149';
    ctx.beginPath();
    ctx.arc(p0x, p0y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Point 2 (Moving Point x1, y1)
    const p1x = centerX + x1 * scale;
    const p1y = centerY - y1 * scale;
    ctx.fillStyle = '#58a6ff';
    ctx.beginPath();
    ctx.arc(p1x, p1y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

  }, [x0, deltaX, secantSlope, trueDerivative, y0, x1, y1]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div>
        <span className="text-[11px] font-mono text-[#8b949e] uppercase">
          Эксперимент 1
        </span>
        <h3 className="text-sm font-semibold text-[#c9d1d9]">Стягивание секущей в касательную (Δx → 0)</h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto aspect-[3/2] block" />
          <div className="absolute top-2.5 left-2.5 bg-[#161b22]/90 backdrop-blur-md px-2 py-1 rounded border border-[#30363d] text-xs font-mono text-[#58a6ff]">
            f(x) = 0.4x²
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Расстояние между точками (Δx):</span>
              <span className="text-[#58a6ff] font-semibold">{deltaX.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="2.5"
              step="0.02"
              value={deltaX}
              onChange={(e) => setDeltaX(parseFloat(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Точка касания X₀:</span>
              <span className="text-[#f85149] font-semibold">{x0.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-2.0"
              max="2.0"
              step="0.2"
              value={x0}
              onChange={(e) => setX0(parseFloat(e.target.value))}
              className="w-full accent-[#f85149] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-center">
            <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
              <span className="text-[10px] text-[#8b949e] block">Наклон секущей</span>
              <span className="text-sm font-semibold text-[#58a6ff]">{secantSlope.toFixed(2)}</span>
            </div>
            <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
              <span className="text-[10px] text-[#8b949e] block">Производная f'(x₀)</span>
              <span className="text-sm font-semibold text-[#d29922]">{trueDerivative.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
