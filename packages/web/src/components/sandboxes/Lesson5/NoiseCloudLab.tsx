import React, { useState, useEffect, useRef } from 'react';
import { MathText } from '../../math/MathText';

interface BasePt {
  x: number;
  noiseOffset: number;
}

const BASE_POINTS: BasePt[] = [
  { x: -3.0, noiseOffset: 0.8 },
  { x: -2.0, noiseOffset: -1.2 },
  { x: -1.0, noiseOffset: 0.4 },
  { x: 0.0, noiseOffset: -0.6 },
  { x: 1.0, noiseOffset: 1.1 },
  { x: 2.0, noiseOffset: -0.9 },
  { x: 3.0, noiseOffset: 0.7 }
];

export const NoiseCloudLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [noiseLevel, setNoiseLevel] = useState<number>(0.6);

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

    // Symmetrical Grid
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

    // Theoretical line y = 1.0x
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(centerX - 4 * scale, centerY - (-4) * scale);
    ctx.lineTo(centerX + 4 * scale, centerY - 4 * scale);
    ctx.stroke();
    ctx.setLineDash([]);

    // Data Points with Noise
    BASE_POINTS.forEach(pt => {
      const realY = 1.0 * pt.x + pt.noiseOffset * noiseLevel;
      const px = centerX + pt.x * scale;
      const py = centerY - realY * scale;

      ctx.fillStyle = '#f0f6fc';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

  }, [noiseLevel]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Эксперимент: Шум в данных</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Реальные данные никогда не лежат на идеальной прямой</h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#d29922] bg-[#0d1117] px-2.5 py-1 rounded border border-[#30363d]">
          Шум (Noise): {(noiseLevel * 100).toFixed(0)}%
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto aspect-[3/2] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Уровень шума факторов (Noise):</span>
              <span className="text-[#58a6ff] font-bold">{(noiseLevel * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.1"
              value={noiseLevel}
              onChange={e => setNoiseLevel(parseFloat(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <p className="text-xs text-[#8b949e] leading-relaxed">
            При нулевом шуме (0%) все точки строго на линии. В жизни цены зависят от этажа, района и ремонта — данные образуют <strong>облако точек</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
