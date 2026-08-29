import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const PredictionTracer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [area, setArea] = useState<number>(50); // m^2

  // Model: ŷ = 0.12x + 2 (in millions)
  const k = 0.12;
  const b = 2.0;
  const yHat = k * area + b;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scaleX = 3.6;
    const scaleY = 18;
    const originX = 50;
    const originY = height - 40;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 100; x += 10) {
      const px = originX + x * scaleX;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, originY); ctx.stroke();
    }
    for (let y = 0; y <= 15; y += 2) {
      const py = originY - y * scaleY;
      ctx.beginPath(); ctx.moveTo(originX, py); ctx.lineTo(width, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#484f58';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(originX, originY); ctx.lineTo(width, originY);
    ctx.moveTo(originX, 0); ctx.lineTo(originX, originY);
    ctx.stroke();

    ctx.fillStyle = '#8b949e';
    ctx.font = '10px monospace';
    ctx.fillText('Площадь x (м²)', width - 90, originY - 6);
    ctx.fillText('Прогноз ŷ (млн ₽)', originX + 6, 14);

    // Line ŷ = 0.12x + 2
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(originX, originY - b * scaleY);
    ctx.lineTo(originX + 100 * scaleX, originY - (k * 100 + b) * scaleY);
    ctx.stroke();

    // Projected point coordinates
    const px = originX + area * scaleX;
    const py = originY - yHat * scaleY;

    // Gold dashed projection lines
    ctx.strokeStyle = '#d29922';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, originY);
    ctx.lineTo(px, py);
    ctx.lineTo(originX, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glowing point dot
    ctx.fillStyle = 'rgba(210, 153, 34, 0.25)';
    ctx.beginPath();
    ctx.arc(px, py, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d29922';
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

  }, [area, yHat]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Трассировщик Prediction</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Формула модели: ŷ = 0.12x + 2</h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#3fb950] bg-[#0d1117] px-3 py-1 rounded border border-[#30363d]">
          ŷ = {yHat.toFixed(2)} млн ₽
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto aspect-[3/2] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Площадь квартиры (x):</span>
              <span className="text-[#58a6ff] font-bold">{area} м²</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="2"
              value={area}
              onChange={e => setArea(Number(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
              <span className="text-[10px] text-[#8b949e] block">Входной признак x</span>
              <span className="text-sm font-bold text-[#58a6ff]">{area} м²</span>
            </div>
            <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
              <span className="text-[10px] text-[#8b949e] block">Прогноз модели ŷ</span>
              <span className="text-sm font-bold text-[#3fb950]">{yHat.toFixed(2)} млн ₽</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] text-center font-mono text-xs">
            <FormulaView latex={`\\hat{y} = 0.12 \\cdot ${area} + 2.0 = ${yHat.toFixed(2)}\\text{ млн ₽}`} displayMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
