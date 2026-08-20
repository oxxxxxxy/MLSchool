import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';
import { Plus } from 'lucide-react';

interface Animal {
  id: number;
  weight: number; // kg
  earLen: number; // cm
  label: 'cat' | 'dog';
}

const INITIAL_DATA: Animal[] = [
  // Cats: small weight, small ears
  { id: 1, weight: -2.5, earLen: -1.5, label: 'cat' },
  { id: 2, weight: -1.8, earLen: -2.2, label: 'cat' },
  { id: 3, weight: -1.2, earLen: -0.8, label: 'cat' },
  { id: 4, weight: -2.8, earLen: -0.2, label: 'cat' },
  // Dogs: bigger weight, bigger ears
  { id: 5, weight: 1.5, earLen: 1.8, label: 'dog' },
  { id: 6, weight: 2.2, earLen: 0.8, label: 'dog' },
  { id: 7, weight: 1.0, earLen: 2.4, label: 'dog' },
  { id: 8, weight: 2.8, earLen: 1.2, label: 'dog' }
];

export const CatVsDogClassifier: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState<number>(-1.0);
  const [b, setB] = useState<number>(0.0);
  const [animals, setAnimals] = useState<Animal[]>(INITIAL_DATA);
  const [newAnimalResult, setNewAnimalResult] = useState<string | null>(null);

  // Decision boundary: line earLen = k * weight + b
  const classify = (weight: number, earLen: number): 'cat' | 'dog' => {
    const lineY = k * weight + b;
    return earLen > lineY ? 'dog' : 'cat';
  };

  const handleAddRandom = () => {
    const randWeight = Math.round((Math.random() * 6 - 3) * 10) / 10;
    const randEar = Math.round((Math.random() * 6 - 3) * 10) / 10;
    const pred = classify(randWeight, randEar);
    const newPet: Animal = {
      id: Date.now(),
      weight: randWeight,
      earLen: randEar,
      label: pred
    };
    setAnimals(prev => [...prev.slice(-12), newPet]);
    setNewAnimalResult(`Добавлен зверёк: вес ${randWeight}, уши ${randEar} → Классифицирован как ${pred === 'cat' ? '🐱 Котик' : '🐶 Пёсик'}!`);
  };

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

    ctx.fillStyle = '#8b949e';
    ctx.font = '10px monospace';
    ctx.fillText('Вес X₁', width - 42, centerY - 6);
    ctx.fillText('Уши X₂', centerX + 6, 14);

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
    animals.forEach(a => {
      const px = centerX + a.weight * scale;
      const py = centerY - a.earLen * scale;

      ctx.fillStyle = a.label === 'cat' ? '#38bdf8' : '#fb923c';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#f0f6fc';
      ctx.font = '10px sans-serif';
      ctx.fillText(a.label === 'cat' ? '🐱' : '🐶', px + 8, py - 4);
    });

  }, [k, b, animals]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Эксперимент 1
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Разделяющая граница: Котики 🐱 против Пёсиков 🐶</h3>
        </div>

        <button
          onClick={handleAddRandom}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] text-xs font-mono border border-[#30363d] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Новый питомец
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto aspect-[3/2] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Наклон границы (k):</span>
              <span className="text-[#58a6ff] font-semibold">{k.toFixed(1)}</span>
            </div>
            <input type="range" min="-3" max="3" step="0.2" value={k} onChange={e => setK(parseFloat(e.target.value))} className="w-full accent-[#58a6ff] cursor-pointer" />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Сдвиг границы (b):</span>
              <span className="text-[#d29922] font-semibold">{b.toFixed(1)}</span>
            </div>
            <input type="range" min="-4" max="4" step="0.2" value={b} onChange={e => setB(parseFloat(e.target.value))} className="w-full accent-[#d29922] cursor-pointer" />
          </div>

          {newAnimalResult && (
            <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] text-xs font-mono text-[#3fb950]">
              {newAnimalResult}
            </div>
          )}

          <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] text-xs text-[#8b949e] leading-relaxed">
            <MathText text="Разделяющая прямая делит плоскость признаков на две зоны: выше линии — зона пёсиков 🐶, ниже линии — зона котиков 🐱." />
          </div>
        </div>
      </div>
    </div>
  );
};
