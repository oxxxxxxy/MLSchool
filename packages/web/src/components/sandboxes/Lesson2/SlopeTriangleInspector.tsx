import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const SlopeTriangleInspector: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k] = useState<number>(2.0);
  const [deltaX, setDeltaX] = useState<number>(2.0);

  const deltaY = k * deltaX;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 28;
    const centerX = width / 2 - 30;
    const centerY = height / 2 + 20;

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

    // Line
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 4 * scale, centerY - (k * -4) * scale);
    ctx.lineTo(centerX + 5 * scale, centerY - (k * 5) * scale);
    ctx.stroke();

    // Triangle
    const c1 = { px: centerX + 1 * scale, py: centerY - (k * 1) * scale };
    const c2 = { px: centerX + (1 + deltaX) * scale, py: centerY - (k * 1) * scale };
    const c3 = { px: centerX + (1 + deltaX) * scale, py: centerY - (k * 1 + deltaY) * scale };

    ctx.fillStyle = 'rgba(88, 166, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(c1.px, c1.py);
    ctx.lineTo(c2.px, c2.py);
    ctx.lineTo(c3.px, c3.py);
    ctx.closePath();
    ctx.fill();

    // Δx
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(c1.px, c1.py);
    ctx.lineTo(c2.px, c2.py);
    ctx.stroke();

    // Δy
    ctx.strokeStyle = '#f85149';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(c2.px, c2.py);
    ctx.lineTo(c3.px, c3.py);
    ctx.stroke();

    ctx.font = '10px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`Δx = ${deltaX}`, (c1.px + c2.px) / 2 - 10, c1.py + 14);

    ctx.fillStyle = '#f85149';
    ctx.fillText(`Δy = ${deltaY.toFixed(1)}`, c2.px + 6, (c2.py + c3.py) / 2 + 4);

  }, [k, deltaX, deltaY]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div>
        <span className="text-[11px] font-mono text-[#8b949e] uppercase">
          Эксперимент 2
        </span>
        <h3 className="text-sm font-semibold text-[#c9d1d9]">Ступенька крутизны: Измерение Δy / Δx</h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[460px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={460} height={260} className="w-full h-auto aspect-[4/3] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Шаг по горизонтали (Δx):</span>
              <span className="text-[#58a6ff]">{deltaX.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={deltaX}
              onChange={(e) => setDeltaX(parseFloat(e.target.value))}
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
