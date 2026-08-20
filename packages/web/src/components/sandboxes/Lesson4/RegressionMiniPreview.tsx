import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const RegressionMiniPreview: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [xVal, setXVal] = useState<number>(3.0);

  // Simple linear model: y = 2.5x + 1
  const k = 2.5;
  const b = 1.0;
  const yVal = k * xVal + b;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 28;
    const centerX = 40;
    const centerY = height - 40;

    ctx.clearRect(0, 0, width, height);

    // Symmetrical Grid
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    for (let x = centerX; x <= width; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
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
    ctx.fillText('Вход X', width - 46, centerY - 6);
    ctx.fillText('Выход Y', centerX + 6, 14);

    // Regression Line
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - b * scale);
    ctx.lineTo(centerX + 8 * scale, centerY - (k * 8 + b) * scale);
    ctx.stroke();

    // Projected lines
    const px = centerX + xVal * scale;
    const py = centerY - yVal * scale;

    ctx.strokeStyle = '#d29922';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, centerY);
    ctx.lineTo(px, py);
    ctx.lineTo(centerX, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glowing Point
    ctx.fillStyle = 'rgba(210, 153, 34, 0.3)';
    ctx.beginPath();
    ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d29922';
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

  }, [xVal, yVal]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">
            Интерактивный блок 1: Регрессия
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Предсказание точного числа по входному X</h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#d29922] bg-[#0d1117] px-2.5 py-1 rounded border border-[#30363d]">
          y = {yVal.toFixed(1)}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[440px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={440} height={260} className="w-full h-auto aspect-[3/2] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Входное число X (Признак):</span>
              <span className="text-[#58a6ff] font-semibold">{xVal.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.1"
              value={xVal}
              onChange={e => setXVal(parseFloat(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] text-xs font-mono text-center">
            <FormulaView latex={`y = 2.5 \\cdot ${xVal.toFixed(1)} + 1.0 = ${yVal.toFixed(2)}`} displayMode={true} />
          </div>

          <p className="text-xs text-[#8b949e] leading-relaxed">
            В регрессии ты подаешь <strong>одно число X</strong> и по линии графика получаешь <strong>предсказанное число Y</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
