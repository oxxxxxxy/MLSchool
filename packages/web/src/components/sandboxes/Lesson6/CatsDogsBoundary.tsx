import React, { useState, useEffect, useRef } from 'react';
import { MathText } from '../../math/MathText';

interface Animal {
  id: number;
  weight: number; // x1
  earLen: number; // x2
  label: 'cat' | 'dog';
}

const DATASET: Animal[] = [
  // Cats (mostly bottom-left, but 1 outlier with big ears)
  { id: 1, weight: -2.5, earLen: -1.5, label: 'cat' },
  { id: 2, weight: -1.8, earLen: -2.2, label: 'cat' },
  { id: 3, weight: -1.2, earLen: -0.8, label: 'cat' },
  { id: 4, weight: -2.8, earLen: -0.2, label: 'cat' },
  { id: 5, weight: -0.8, earLen: 1.0, label: 'cat' }, // Outlier cat
  // Dogs (mostly top-right, but 1 outlier smaller)
  { id: 6, weight: 1.5, earLen: 1.8, label: 'dog' },
  { id: 7, weight: 2.2, earLen: 0.8, label: 'dog' },
  { id: 8, weight: 1.0, earLen: 2.4, label: 'dog' },
  { id: 9, weight: 2.8, earLen: 1.2, label: 'dog' },
  { id: 10, weight: -0.5, earLen: -0.5, label: 'dog' } // Small dog outlier
];

export const CatsDogsBoundary: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState<number>(-1.0);
  const [b, setB] = useState<number>(0.0);

  // Compute accuracy
  const stats = DATASET.reduce(
    (acc, pet) => {
      const lineY = k * pet.weight + b;
      const pred = pet.earLen > lineY ? 'dog' : 'cat';
      if (pred === pet.label) acc.correct++;
      else acc.errors++;
      return acc;
    },
    { correct: 0, errors: 0 }
  );

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

    // Grid
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
    ctx.fillText('Масса x₁', width - 52, centerY - 6);
    ctx.fillText('Уши x₂', centerX + 6, 14);

    // Decision Boundary Line
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const xMin = -centerX / scale;
    const xMax = (width - centerX) / scale;
    ctx.moveTo(centerX + xMin * scale, centerY - (k * xMin + b) * scale);
    ctx.lineTo(centerX + xMax * scale, centerY - (k * xMax + b) * scale);
    ctx.stroke();

    // Data Points
    DATASET.forEach(pet => {
      const px = centerX + pet.weight * scale;
      const py = centerY - pet.earLen * scale;
      const lineY = k * pet.weight + b;
      const pred = pet.earLen > lineY ? 'dog' : 'cat';
      const isWrong = pred !== pet.label;

      ctx.fillStyle = pet.label === 'cat' ? '#38bdf8' : '#fb923c';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isWrong ? '#f85149' : '#ffffff';
      ctx.lineWidth = isWrong ? 2.5 : 1.5;
      ctx.stroke();

      ctx.fillStyle = '#f0f6fc';
      ctx.font = '10px sans-serif';
      ctx.fillText(pet.label === 'cat' ? '🐱' : '🐶', px + 8, py - 4);
    });

  }, [k, b]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Разделяющая граница</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Коты 🐱 против Собак 🐶 на плоскости признаков</h3>
        </div>
        <div className="flex gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-[#238636]/20 border border-[#2ea043] text-[#3fb950] font-bold">
            Правильно: {stats.correct}
          </span>
          <span className="px-2.5 py-1 rounded bg-[#da3633]/20 border border-[#f85149] text-[#f85149] font-bold">
            Ошибок: {stats.errors}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto aspect-[3/2] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Наклон границы (k):</span>
              <span className="text-[#58a6ff] font-bold">{k.toFixed(1)}</span>
            </div>
            <input type="range" min="-3" max="3" step="0.2" value={k} onChange={e => setK(parseFloat(e.target.value))} className="w-full accent-[#58a6ff] cursor-pointer" />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Сдвиг границы (b):</span>
              <span className="text-[#d29922] font-bold">{b.toFixed(1)}</span>
            </div>
            <input type="range" min="-3" max="3" step="0.2" value={b} onChange={e => setB(parseFloat(e.target.value))} className="w-full accent-[#d29922] cursor-pointer" />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border-l-2 border-[#58a6ff] text-xs text-[#8b949e] leading-relaxed">
            Модель пытается расположить границу так, чтобы ошибаться как можно реже. Реальные данные пересекаются, поэтому идеальной границы без единой ошибки часто не существует.
          </div>
        </div>
      </div>
    </div>
  );
};
