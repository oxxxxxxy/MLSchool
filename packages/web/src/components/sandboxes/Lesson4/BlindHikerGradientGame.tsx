import React, { useState } from 'react';
import { Mountain, ArrowLeft, ArrowRight, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BlindHikerGradientGame: React.FC = () => {
  const [posX, setPosX] = useState<number>(4.2);
  const [stepsCount, setStepsCount] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);

  // Mountain Gorge: f(x) = 0.5 * x^2 => Minimum at x = 0
  // Slope under feet = x
  const currentSlope = posX;

  const handleStep = (direction: 'left' | 'right') => {
    if (isWon) return;
    const stepSize = 0.8;
    const newX = direction === 'left' ? posX - stepSize : posX + stepSize;
    const roundedX = Math.round(newX * 10) / 10;
    setPosX(roundedX);
    setStepsCount(prev => prev + 1);

    if (Math.abs(roundedX) <= 0.4) {
      setIsWon(true);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    setPosX(4.2);
    setStepsCount(0);
    setIsWon(false);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Мини-игра: Слепой Альпинист в тумане
          </span>
          <h3 className="text-lg font-bold text-white">Рождение Градиентного Спуска</h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">Сделано шагов: {stepsCount}</span>
          <button
            onClick={handleRestart}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
        {/* Foggy Stage */}
        <div className="relative py-8 px-4 rounded-2xl bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
            <Mountain className="w-4 h-4 text-amber-400" />
            <span>Вокруг плотный туман! Ты чувствуешь только наклон под ногами:</span>
          </div>

          <div className="text-3xl font-black font-mono text-amber-400">
            Наклон земли f'(x) = {currentSlope > 0 ? `+${currentSlope.toFixed(1)} (Подъем вправо)` : `${currentSlope.toFixed(1)} (Спуск вправо)`}
          </div>

          {isWon ? (
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 font-bold text-sm animate-bounce flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-400" />
              ПОБЕДА! Ты спустился на дно ущелья (Минимум ошибки найден)!
            </div>
          ) : (
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {currentSlope > 0
                ? 'Склон идет вверх направо. Чтобы спускаться вниз к озеру, нужно шагать ВЛЕВО!'
                : 'Склон падает направо. Чтобы спускаться вниз, шагай ВПРАВО!'}
            </p>
          )}

          {/* Stepping controls */}
          <div className="flex gap-4 justify-center pt-2">
            <button
              disabled={isWon}
              onClick={() => handleStep('left')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              Шаг влево (Назад)
            </button>
            <button
              disabled={isWon}
              onClick={() => handleStep('right')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              Шаг вправо (Вперед)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
