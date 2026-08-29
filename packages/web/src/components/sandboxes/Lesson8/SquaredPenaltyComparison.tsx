import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const SquaredPenaltyComparison: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [errorVal, setErrorVal] = useState<number>(3.0);

  const absVal = Math.abs(errorVal);
  const sqVal = errorVal * errorVal;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scaleX = 35;
    const scaleY = 6;
    const centerX = width / 2;
    const centerY = height - 30;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    for (let x = centerX; x <= width; x += scaleX) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, centerY); ctx.stroke();
    }
    for (let x = centerX; x >= 0; x -= scaleX) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, centerY); ctx.stroke();
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
    ctx.fillText('Ошибка e', width - 56, centerY - 6);
    ctx.fillText('Штраф e²', centerX + 6, 14);

    // Parabola curve y = e^2
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const e = (px - centerX) / scaleX;
      const penalty = e * e;
      const py = centerY - penalty * scaleY;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Active Point
    const currentPx = centerX + errorVal * scaleX;
    const currentPy = centerY - sqVal * scaleY;

    // Projected lines
    ctx.strokeStyle = '#d29922';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(currentPx, centerY);
    ctx.lineTo(currentPx, currentPy);
    ctx.lineTo(centerX, currentPy);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#d29922';
    ctx.beginPath();
    ctx.arc(currentPx, currentPy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

  }, [errorVal, sqVal]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Парабола штрафа</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Как квадрат ошибки (e²) наказывает за большие промахи</h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#d29922] bg-[#0d1117] px-2.5 py-1 rounded border border-[#30363d]">
          e² = {sqVal.toFixed(1)}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto aspect-[3/2] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Ошибка прогноза (e):</span>
              <span className="text-[#58a6ff] font-bold">{errorVal.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-6.0"
              max="6.0"
              step="0.2"
              value={errorVal}
              onChange={e => setErrorVal(parseFloat(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded bg-[#0d1117] border border-[#30363d]">
              <span className="text-[9px] text-[#8b949e] block">Ошибка e</span>
              <span className="text-xs font-bold text-[#58a6ff]">{errorVal.toFixed(1)}</span>
            </div>
            <div className="p-2 rounded bg-[#0d1117] border border-[#30363d]">
              <span className="text-[9px] text-[#8b949e] block">Модуль |e|</span>
              <span className="text-xs font-bold text-[#c9d1d9]">{absVal.toFixed(1)}</span>
            </div>
            <div className="p-2 rounded bg-[#0d1117] border border-[#30363d]">
              <span className="text-[9px] text-[#8b949e] block">Квадрат e²</span>
              <span className="text-xs font-bold text-[#d29922]">{sqVal.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-xs text-[#8b949e] leading-relaxed">
            Если ошибка 2 $\to$ штраф 4. Если ошибка 10 $\to$ штраф 100! Квадрат делает так, чтобы модель сильнее всего боялась огромных промахов.
          </p>
        </div>
      </div>
    </div>
  );
};
