import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Rocket } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';

export const RocketRaceSimulation: React.FC = () => {
  const [timeX, setTimeX] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const linearY = 8 * timeX;
  const quadY = timeX * timeX;

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setTimeX(prev => {
          if (prev >= 15) {
            setIsPlaying(false);
            return 15;
          }
          return Math.round((prev + 0.1) * 10) / 10;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Интерактивный эксперимент 2
          </span>
          <h3 className="text-lg font-bold text-white">Гонка Ракет: Линейный vs Квадратичный Рост</h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Пауза' : 'Старт гонки'}</span>
          </button>
          <button
            onClick={() => { setTimeX(0); setIsPlaying(false); }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Race track */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
        <div className="space-y-4">
          {/* Rocket 1: Linear */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-sky-400 flex items-center gap-1">
                <Rocket className="w-3.5 h-3.5" />
                Ракета 1: Линейная (y = 8x)
              </span>
              <span className="text-sky-300 font-mono">Высота: {linearY.toFixed(1)} м</span>
            </div>
            <div className="w-full h-5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-75 rounded-full"
                style={{ width: `${Math.min(100, (linearY / 225) * 100)}%` }}
              />
            </div>
          </div>

          {/* Rocket 2: Quadratic */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-400 flex items-center gap-1">
                <Rocket className="w-3.5 h-3.5" />
                Ракета 2: Параболическая (y = x²)
              </span>
              <span className="text-emerald-300 font-mono">Высота: {quadY.toFixed(1)} м</span>
            </div>
            <div className="w-full h-5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-75 rounded-full"
                style={{ width: `${Math.min(100, (quadY / 225) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 font-mono">Время X: {timeX.toFixed(1)} сек</span>
          <span className={`font-bold ${timeX > 8 ? 'text-emerald-400' : 'text-sky-400'}`}>
            {timeX === 0 ? 'Готовы к старту!' : timeX < 8 ? 'Линейная ракета лидирует!' : '🚀 Параболическая ракета вырвалась вперед в космос!'}
          </span>
        </div>
      </div>
    </div>
  );
};
