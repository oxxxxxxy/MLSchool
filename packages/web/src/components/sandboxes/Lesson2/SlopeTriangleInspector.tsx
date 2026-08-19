import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const SlopeTriangleInspector: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState<number>(2.0);
  const [deltaX, setDeltaX] = useState<number>(1.5);
  const [startX, setStartX] = useState<number>(-1.0);

  const startY = k * startX;
  const deltaY = k * deltaX;
  const endX = startX + deltaX;
  const endY = startY + deltaY;

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

    // Grid aligned exactly to origin (centerX, centerY)
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

    // Main line y = kx
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const xMin = -centerX / scale;
    const xMax = (width - centerX) / scale;
    ctx.moveTo(centerX + xMin * scale, centerY - k * xMin * scale);
    ctx.lineTo(centerX + xMax * scale, centerY - k * xMax * scale);
    ctx.stroke();

    // Triangle Coordinates
    const p1 = { px: centerX + startX * scale, py: centerY - startY * scale };
    const p2 = { px: centerX + endX * scale, py: centerY - startY * scale };
    const p3 = { px: centerX + endX * scale, py: centerY - endY * scale };

    // Triangle Fill
    ctx.fillStyle = 'rgba(88, 166, 255, 0.12)';
    ctx.beginPath();
    ctx.moveTo(p1.px, p1.py);
    ctx.lineTo(p2.px, p2.py);
    ctx.lineTo(p3.px, p3.py);
    ctx.closePath();
    ctx.fill();

    // Horizontal leg Δx (Cyan)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(p1.px, p1.py);
    ctx.lineTo(p2.px, p2.py);
    ctx.stroke();

    // Vertical leg Δy (Rose)
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(p2.px, p2.py);
    ctx.lineTo(p3.px, p3.py);
    ctx.stroke();

    // Vertices dots
    [p1, p3].forEach(p => {
      ctx.fillStyle = '#f0f6fc';
      ctx.beginPath();
      ctx.arc(p.px, p.py, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Labels
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`Δx = ${deltaX.toFixed(1)}`, (p1.px + p2.px) / 2 - 16, p1.py + (k >= 0 ? 16 : -8));

    ctx.fillStyle = '#f87171';
    ctx.fillText(`Δy = ${deltaY.toFixed(1)}`, p2.px + 8, (p2.py + p3.py) / 2 + 4);

  }, [k, deltaX, startX, startY, deltaY, endX, endY]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div>
        <span className="text-[11px] font-mono text-[#8b949e] uppercase">
          Эксперимент 2
        </span>
        <h3 className="text-sm font-semibold text-[#c9d1d9]">Ступенька крутизны: Измерение Δy / Δx</h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto aspect-[3/2] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Шаг по горизонтали (Δx):</span>
              <span className="text-[#38bdf8] font-semibold">{deltaX.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={deltaX}
              onChange={(e) => setDeltaX(parseFloat(e.target.value))}
              className="w-full accent-[#38bdf8] cursor-pointer"
            />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Крутизна прямой (k):</span>
              <span className="text-[#58a6ff] font-semibold">{k.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.5"
              value={k}
              onChange={(e) => setK(parseFloat(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] text-center font-mono text-xs text-[#c9d1d9]">
            <FormulaView latex={`k = \\frac{\\Delta y}{\\Delta x} = \\frac{${deltaY.toFixed(1)}}{${deltaX.toFixed(1)}} = ${k.toFixed(1)}`} displayMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
