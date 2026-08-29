import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const TrueVsPredictedResidual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [trueX] = useState<number>(3.0);
  const [trueY] = useState<number>(8.0); // True house price: 8 mln
  const [k, setK] = useState<number>(1.5);
  const [b, setB] = useState<number>(1.5);

  const yHat = k * trueX + b;
  const residual = yHat - trueY;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 24;
    const centerX = 60;
    const centerY = height - 40;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 10; x++) {
      const px = centerX + x * scale;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, centerY); ctx.stroke();
    }
    for (let y = 0; y <= 12; y++) {
      const py = centerY - y * scale;
      ctx.beginPath(); ctx.moveTo(centerX, py); ctx.lineTo(width, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#484f58';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY); ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, centerY);
    ctx.stroke();

    ctx.fillStyle = '#8b949e';
    ctx.font = '10px monospace';
    ctx.fillText('x (Признак)', width - 70, centerY - 6);
    ctx.fillText('y (Цена)', centerX + 6, 14);

    // Model line ŷ = kx + b
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - b * scale);
    ctx.lineTo(centerX + 8 * scale, centerY - (k * 8 + b) * scale);
    ctx.stroke();

    const ptPx = centerX + trueX * scale;
    const truePy = centerY - trueY * scale;
    const predPy = centerY - yHat * scale;

    // Vertical residual error line
    ctx.strokeStyle = residual > 0 ? '#3fb950' : '#f85149';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ptPx, truePy);
    ctx.lineTo(ptPx, predPy);
    ctx.stroke();

    // True Point (x, y)
    ctx.fillStyle = '#f0f6fc';
    ctx.beginPath();
    ctx.arc(ptPx, truePy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3fb950';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#3fb950';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`Факт y = ${trueY}`, ptPx + 10, truePy - 4);

    // Prediction Point (x, ŷ)
    ctx.fillStyle = '#d29922';
    ctx.beginPath();
    ctx.arc(ptPx, predPy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#58a6ff';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`Прогноз ŷ = ${yHat.toFixed(1)}`, ptPx + 10, predPy + 14);

  }, [trueX, trueY, k, b, yHat, residual]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Факт против Прогноза</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Ошибка одной точки (Residual): e = ŷ - y</h3>
        </div>
        <span className={`text-xs font-mono font-bold px-3 py-1 rounded border ${
          residual === 0 ? 'bg-[#238636]/20 text-[#3fb950]' : 'bg-[#da3633]/20 text-[#f85149] border-[#f85149]'
        }`}>
          e = {residual.toFixed(2)}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto aspect-[3/2] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Наклон модели (k):</span>
              <span className="text-[#58a6ff] font-bold">{k.toFixed(1)}</span>
            </div>
            <input type="range" min="0.5" max="3.0" step="0.1" value={k} onChange={e => setK(parseFloat(e.target.value))} className="w-full accent-[#58a6ff] cursor-pointer" />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Сдвиг модели (b):</span>
              <span className="text-[#d29922] font-bold">{b.toFixed(1)}</span>
            </div>
            <input type="range" min="-2.0" max="6.0" step="0.2" value={b} onChange={e => setB(parseFloat(e.target.value))} className="w-full accent-[#d29922] cursor-pointer" />
          </div>

          <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] text-center font-mono text-xs">
            <FormulaView latex={`e = \\hat{y} - y = ${yHat.toFixed(1)} - ${trueY} = ${residual.toFixed(2)}`} displayMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
