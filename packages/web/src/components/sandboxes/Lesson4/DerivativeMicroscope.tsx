import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const DerivativeMicroscope: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lensX, setLensX] = useState<number>(1.2);

  const fn = (x: number) => Math.sin(x) + 0.3 * x;
  const slope = Math.cos(lensX) + 0.3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 28;
    const centerX = width / 2 - 20;
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

    // Curve
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

    // Lens
    const lensPx = centerX + lensX * scale;
    const lensPy = centerY - fn(lensX) * scale;

    ctx.fillStyle = 'rgba(22, 27, 34, 0.9)';
    ctx.beginPath();
    ctx.arc(lensPx, lensPy, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tangent Stick inside Lens
    ctx.strokeStyle = slope > 0.1 ? '#3fb950' : slope < -0.1 ? '#f85149' : '#d29922';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const stickLen = 28;
    const angle = Math.atan(slope);
    ctx.moveTo(lensPx - Math.cos(angle) * stickLen, lensPy + Math.sin(angle) * stickLen);
    ctx.lineTo(lensPx + Math.cos(angle) * stickLen, lensPy - Math.sin(angle) * stickLen);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(lensPx, lensPy, 3.5, 0, Math.PI * 2);
    ctx.fill();

  }, [lensX, slope]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div>
        <span className="text-[11px] font-mono text-[#8b949e] uppercase">
          Эксперимент 3
        </span>
        <h3 className="text-sm font-semibold text-[#c9d1d9]">Микроскоп касательной: Локальная прямизна</h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[460px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={460} height={260} className="w-full h-auto aspect-[4/3] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Положение лупы X:</span>
              <span className="text-[#58a6ff]">{lensX.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.1"
              value={lensX}
              onChange={(e) => setLensX(parseFloat(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] text-center font-mono text-xs">
            <span className="text-[10px] text-[#8b949e] block">Наклон касательной = f'(x)</span>
            <div className="text-sm font-bold text-[#f0f6fc] mt-0.5">
              f'({lensX.toFixed(1)}) = {slope.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
