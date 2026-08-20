import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const RegressionMiniPreview: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [xVal, setXVal] = useState<number>(2.0);

  // Linear function: y = 1.5x - 0.5
  const k = 1.5;
  const b = -0.5;
  const yVal = k * xVal + b;

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

    // Symmetrical Grid from origin
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

    // Full Ghost Line
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const xMin = -centerX / scale;
    const xMax = (width - centerX) / scale;
    ctx.moveTo(centerX + xMin * scale, centerY - (k * xMin + b) * scale);
    ctx.lineTo(centerX + xMax * scale, centerY - (k * xMax + b) * scale);
    ctx.stroke();

    // Active Traced Line up to X
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX + xMin * scale, centerY - (k * xMin + b) * scale);
    ctx.lineTo(centerX + xVal * scale, centerY - (k * xVal + b) * scale);
    ctx.stroke();

    // Projected point coordinates
    const px = centerX + xVal * scale;
    const py = centerY - yVal * scale;

    // Gold dashed projection lines
    ctx.strokeStyle = '#d29922';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, centerY);
    ctx.lineTo(px, py);
    ctx.lineTo(centerX, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glowing point dot
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
        {/* Canvas strictly 480x320 with aspect-[3/2] */}
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto aspect-[3/2] block" />
          <div className="absolute top-2.5 left-2.5 bg-[#161b22]/90 backdrop-blur-md px-2 py-1 rounded border border-[#30363d] text-xs font-mono text-[#58a6ff]">
            y = 1.5x - 0.5
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Входное число X (Признак):</span>
              <span className="text-[#58a6ff] font-semibold">{xVal.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-4.0"
              max="5.0"
              step="0.1"
              value={xVal}
              onChange={e => setXVal(parseFloat(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
              <span className="text-[10px] text-[#8b949e] block">Вход X</span>
              <span className="text-sm font-bold text-[#58a6ff]">{xVal.toFixed(1)}</span>
            </div>
            <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
              <span className="text-[10px] text-[#8b949e] block">Прогноз Y</span>
              <span className="text-sm font-bold text-[#3fb950]">{yVal.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] text-xs font-mono text-center">
            <FormulaView latex={`y = 1.5 \\cdot (${xVal.toFixed(1)}) - 0.5 = ${yVal.toFixed(2)}`} displayMode={true} />
          </div>

          <p className="text-xs text-[#8b949e] leading-relaxed">
            В регрессии ты подаешь <strong>одно число X</strong> и по линии графика получаешь <strong>предсказанное число Y</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
