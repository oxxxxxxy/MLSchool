import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

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
    }
  }, [k, b, gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 24;
    const centerX = width / 2;
    const centerY = height / 2;

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

    // Targets
    gameState.targets.forEach(t => {
      const px = centerX + t.x * scale;
      const py = centerY - t.y * scale;
      const lineY = k * t.x + b;
      const isHit = Math.abs(lineY - t.y) <= t.radius;

      ctx.fillStyle = isHit ? 'rgba(63, 185, 80, 0.3)' : 'rgba(248, 81, 73, 0.2)';
      ctx.beginPath();
      ctx.arc(px, py, t.radius * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isHit ? '#3fb950' : '#f85149';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Laser
    ctx.strokeStyle = isWon ? '#3fb950' : '#f85149';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const xMin = -10;
    const xMax = 10;
    ctx.moveTo(centerX + xMin * scale, centerY - (k * xMin + b) * scale);
    ctx.lineTo(centerX + xMax * scale, centerY - (k * xMax + b) * scale);
    ctx.stroke();

  }, [k, b, isWon, gameState]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Игра (Уровень {level})
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Лазерный стрелок</h3>
        </div>

        <button
          onClick={handleNextLevel}
          className={`px-3 py-1 rounded text-xs font-mono transition-colors border ${
            isWon
              ? 'bg-[#238636] text-white border-[#2ea043]'
              : 'bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]'
          }`}
        >
          {isWon ? 'Следующий уровень →' : 'Сменить цели'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[460px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={460} height={260} className="w-full h-auto aspect-[4/3] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Наклон k:</span>
              <span className="text-[#58a6ff]">{k.toFixed(1)}</span>
            </div>
            <input type="range" min="-4" max="4" step="0.1" value={k} onChange={e => { setK(parseFloat(e.target.value)); setIsWon(false); }} className="w-full accent-[#58a6ff] cursor-pointer" />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Сдвиг b:</span>
              <span className="text-[#d29922]">{b.toFixed(1)}</span>
            </div>
            <input type="range" min="-6" max="6" step="0.2" value={b} onChange={e => { setB(parseFloat(e.target.value)); setIsWon(false); }} className="w-full accent-[#d29922] cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};
