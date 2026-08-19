import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { MathText } from '../../math/MathText';

export const BlindHikerGradientGame: React.FC = () => {
  const [posX, setPosX] = useState<number>(4.2);
  const [stepsCount, setStepsCount] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);

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
    }
  };

  const handleRestart = () => {
    setPosX(4.2);
    setStepsCount(0);
    setIsWon(false);
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Игра
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Слепой альпинист: Поиск дна по знаку наклона</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#8b949e]">
          <span>Шагов: {stepsCount}</span>
          <button onClick={handleRestart} className="p-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9]">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] text-center space-y-3">
        <span className="text-xs font-mono text-[#8b949e] block">Наклон земли под ногами:</span>
        <div className="text-xl font-mono font-bold text-[#d29922]">
          f'(x) = {currentSlope > 0 ? `+${currentSlope.toFixed(1)} (Подъем вправо)` : `${currentSlope.toFixed(1)} (Спуск вправо)`}
        </div>

        {isWon ? (
          <div className="p-2 rounded bg-[#238636]/20 border border-[#2ea043] text-xs text-[#3fb950] font-mono font-semibold">
            Дно ущелья найдено (f'(x) = 0)!
          </div>
        ) : (
          <div className="text-xs text-[#8b949e]">
            {currentSlope > 0 ? 'Склон идет вверх направо — шагай влево.' : 'Склон падает направо — шагай вправо.'}
          </div>
        )}

        <div className="flex gap-2 justify-center pt-1">
          <button
            disabled={isWon}
            onClick={() => handleStep('left')}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#21262d] hover:bg-[#30363d] disabled:opacity-40 text-[#c9d1d9] font-mono text-xs border border-[#30363d] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Шаг влево
          </button>
          <button
            disabled={isWon}
            onClick={() => handleStep('right')}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#21262d] hover:bg-[#30363d] disabled:opacity-40 text-[#c9d1d9] font-mono text-xs border border-[#30363d] transition-colors"
          >
            Шаг вправо
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
