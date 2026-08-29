import React, { useState, useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const FreezeBInteractive: React.FC = () => {
  const lineCanvasRef = useRef<HTMLCanvasElement>(null);
  const lossCanvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState<number>(0.8);
  const fixedB = 1.0;

  // Dataset: (1,3), (2,5), (3,7) -> optimal k = 2
  // Loss(k) = 1/3 * [ (k+1 - 3)^2 + (2k+1 - 5)^2 + (3k+1 - 7)^2 ]
  // = 1/3 * [ (k-2)^2 + (2(k-2))^2 + (3(k-2))^2 ]
  // = 1/3 * (1 + 4 + 9) * (k-2)^2 = (14/3) * (k-2)^2 ≈ 4.67 * (k-2)^2
  const lossVal = (14 / 3) * (k - 2) * (k - 2);
  const dLdk = (28 / 3) * (k - 2); // derivative with respect to k

  // Render Line Canvas
  useEffect(() => {
    const canvas = lineCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 24;
    const centerX = 40;
    const centerY = height - 30;

    ctx.clearRect(0, 0, width, height);

    // Axes
    ctx.strokeStyle = '#484f58';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY); ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, centerY);
    ctx.stroke();

    // Data points (1,3), (2,5), (3,7)
    const pts = [{ x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: 7 }];
    pts.forEach(p => {
      const px = centerX + p.x * scale;
      const py = centerY - p.y * scale;
      ctx.fillStyle = '#3fb950';
      ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2); ctx.fill();
    });

    // Line ŷ = kx + fixedB
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - fixedB * scale);
    ctx.lineTo(centerX + 6 * scale, centerY - (k * 6 + fixedB) * scale);
    ctx.stroke();

  }, [k, fixedB]);

  // Render Loss(k) Parabola Canvas
  useEffect(() => {
    const canvas = lossCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scaleK = 40;
    const scaleL = 8;
    const originX = width / 2;
    const originY = height - 30;

    ctx.clearRect(0, 0, width, height);

    // Axes
    ctx.strokeStyle = '#484f58';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, originY); ctx.lineTo(width, originY);
    ctx.moveTo(originX, 0); ctx.lineTo(originX, height);
    ctx.stroke();

    ctx.fillStyle = '#8b949e';
    ctx.font = '10px monospace';
    ctx.fillText('k', width - 14, originY - 6);
    ctx.fillText('Loss(k)', originX + 6, 14);

    // Parabola curve Loss(k)
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const testK = (px - originX) / scaleK + 2.0; // center optimal k=2
      const l = (14 / 3) * (testK - 2) * (testK - 2);
      const py = originY - l * scaleL;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Active Point on Loss curve
    const curPx = originX + (k - 2.0) * scaleK;
    const curPy = originY - lossVal * scaleL;

    // Tangent line at current k
    const tanSlope = dLdk;
    ctx.strokeStyle = '#d29922';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(curPx - 25, curPy + 25 * tanSlope * (scaleL / scaleK));
    ctx.lineTo(curPx + 25, curPy - 25 * tanSlope * (scaleL / scaleK));
    ctx.stroke();
    ctx.setLineDash([]);

    // Point dot
    ctx.fillStyle = '#d29922';
    ctx.beginPath();
    ctx.arc(curPx, curPy, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

  }, [k, lossVal, dLdk]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#d29922]" />
          <div>
            <span className="text-[11px] font-mono text-[#d29922] uppercase">Параметр b заморожен (b = 1.0)</span>
            <h3 className="text-sm font-semibold text-[#c9d1d9]">Производная ошибки ∂L/∂k</h3>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-[#58a6ff] bg-[#0d1117] px-2.5 py-1 rounded border border-[#30363d]">
          ∂L/∂k = {dLdk.toFixed(2)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Line */}
        <div className="space-y-1">
          <span className="text-xs font-mono text-[#8b949e] block">Прямая ŷ = {k.toFixed(1)}x + 1.0:</span>
          <div className="relative rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117]">
            <canvas ref={lineCanvasRef} width={360} height={220} className="w-full h-auto aspect-[3/2] block" />
          </div>
        </div>

        {/* Right: Loss(k) with tangent */}
        <div className="space-y-1">
          <span className="text-xs font-mono text-[#8b949e] block">График ошибки Loss(k) с касательной:</span>
          <div className="relative rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117]">
            <canvas ref={lossCanvasRef} width={360} height={220} className="w-full h-auto aspect-[3/2] block" />
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-[#8b949e]">Крутим только наклон k:</span>
          <span className="text-[#58a6ff] font-bold">{k.toFixed(1)}</span>
        </div>
        <input type="range" min="0.0" max="4.0" step="0.1" value={k} onChange={e => setK(parseFloat(e.target.value))} className="w-full accent-[#58a6ff] cursor-pointer" />
      </div>
    </div>
  );
};
