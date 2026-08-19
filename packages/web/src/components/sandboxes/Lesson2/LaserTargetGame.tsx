import React, { useState, useEffect, useRef } from 'react';
import { Target, Zap, Trophy, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FormulaView } from '../../math/FormulaView';

interface DroneTarget {
  id: number;
  x: number;
  y: number;
  radius: number;
}

export const LaserTargetGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState<number>(1.0);
  const [b, setB] = useState<number>(0.0);
  const [isWon, setIsWon] = useState(false);
  const [level, setLevel] = useState(1);

  // Solvable target generators
  const generateTargets = (lvl: number): { targets: DroneTarget[]; trueK: number; trueB: number } => {
    const configs = [
      { trueK: 2, trueB: 2, xs: [-3, 0, 3] },
      { trueK: -1, trueB: 3, xs: [-4, 0, 4] },
      { trueK: 1.5, trueB: -1, xs: [-2, 0, 2] },
      { trueK: -2, trueB: 0, xs: [-3, 0, 3] },
      { trueK: 0.5, trueB: 2, xs: [-4, 0, 4] }
    ];
    const cfg = configs[(lvl - 1) % configs.length];
    const targets = cfg.xs.map((xVal, i) => ({
      id: i + 1,
      x: xVal,
      y: cfg.trueK * xVal + cfg.trueB,
      radius: 0.6
    }));
    return { targets, trueK: cfg.trueK, trueB: cfg.trueB };
  };

  const [gameState, setGameState] = useState(() => generateTargets(1));

  const checkHits = () => {
    return gameState.targets.every(t => {
      const lineY = k * t.x + b;
      return Math.abs(lineY - t.y) <= t.radius;
    });
  };

  const handleNextLevel = () => {
    const nextLvl = level + 1;
    setLevel(nextLvl);
    setGameState(generateTargets(nextLvl));
    setK(0);
    setB(0);
    setIsWon(false);
  };

  useEffect(() => {
    const hitsAll = checkHits();
    if (hitsAll && !isWon) {
      setIsWon(true);
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    }
  }, [k, b, gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 25;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
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

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Drone targets
    gameState.targets.forEach(t => {
      const px = centerX + t.x * scale;
      const py = centerY - t.y * scale;
      const lineY = k * t.x + b;
      const isHit = Math.abs(lineY - t.y) <= t.radius;

      ctx.fillStyle = isHit ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.3)';
      ctx.beginPath();
      ctx.arc(px, py, t.radius * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isHit ? '#10b981' : '#f43f5e';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Laser Beam
    ctx.strokeStyle = isWon ? '#10b981' : '#f43f5e';
    ctx.lineWidth = 4;
    ctx.shadowColor = isWon ? '#10b981' : '#f43f5e';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    const xMin = -10;
    const xMax = 10;
    ctx.moveTo(centerX + xMin * scale, centerY - (k * xMin + b) * scale);
    ctx.lineTo(centerX + xMax * scale, centerY - (k * xMax + b) * scale);
    ctx.stroke();
    ctx.shadowBlur = 0;

  }, [k, b, isWon, gameState]);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Мини-игра: Лазерный стрелок (Уровень {level})
          </span>
          <h3 className="text-lg font-bold text-white">Сбей Все Дроны Одним Лазером!</h3>
        </div>

        <div className="flex gap-2">
          {isWon ? (
            <button
              onClick={handleNextLevel}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all animate-bounce"
            >
              <Sparkles className="w-4 h-4" />
              Следующий уровень →
            </button>
          ) : (
            <button
              onClick={handleNextLevel}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Новая расстановка
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-inner">
          <canvas ref={canvasRef} width={460} height={300} className="w-full max-w-[460px] h-[300px] block" />
        </div>

        <div className="flex-1 w-full space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-400">Наклон луча k:</span>
              <span className="text-sky-400 font-mono">{k.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.1"
              value={k}
              onChange={(e) => setK(parseFloat(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-400">Сдвиг пушки b:</span>
              <span className="text-amber-400 font-mono">{b.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              step="0.2"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            🎯 <strong>Подсказка:</strong> Посмотри, на какой высоте висит дрон на центральной оси $X = 0$ — это и есть твой сдвиг $b$! Затем поверни луч наклоном $k$.
          </div>
        </div>
      </div>
    </div>
  );
};
