import React, { useState, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { MathText } from '../../math/MathText';

export const ThreeLearningRatesRace: React.FC = () => {
  const [epoch, setEpoch] = useState<number>(0);
  const [model1Loss, setModel1Loss] = useState<number>(50); // Small lr = 0.0001
  const [model2Loss, setModel2Loss] = useState<number>(50); // Optimal lr = 0.02
  const [model3Loss, setModel3Loss] = useState<number>(50); // Huge lr = 0.5
  const [isRacing, setIsRacing] = useState<boolean>(false);

  const handleReset = () => {
    setEpoch(0);
    setModel1Loss(50);
    setModel2Loss(50);
    setModel3Loss(50);
    setIsRacing(false);
  };

  useEffect(() => {
    let timer: any;
    if (isRacing && epoch < 40) {
      timer = setInterval(() => {
        setEpoch(prev => prev + 1);
        setModel1Loss(prev => Math.max(35, prev * 0.992)); // crawls slowly
        setModel2Loss(prev => Math.max(0.05, prev * 0.82)); // converges smoothly
        setModel3Loss(prev => (prev > 100 ? prev : prev * 1.35)); // oscillates & explodes!
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isRacing, epoch]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#d29922] uppercase">Интерактивный эксперимент</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Гонка трех моделей: Влияние Learning Rate (α)</h3>
        </div>
        <button onClick={handleReset} className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d]">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Model 1: Too small */}
        <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#8b949e]">1. Слишком малый (α = 0.0001):</span>
          </div>
          <div className="text-sm font-bold font-mono text-[#58a6ff]">Loss = {model1Loss.toFixed(1)}</div>
          <div className="w-full h-2 rounded bg-[#161b22] overflow-hidden">
            <div className="h-full bg-[#58a6ff] transition-all" style={{ width: `${Math.min(100, model1Loss * 2)}%` }} />
          </div>
          <span className="text-[10px] text-[#8b949e] block">🐢 Ползет еле заметно, учиться будет вечность.</span>
        </div>

        {/* Model 2: Optimal */}
        <div className="p-3 rounded-lg bg-[#0d1117] border border-[#2ea043] space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#3fb950] font-bold">2. Оптимальный (α = 0.02):</span>
          </div>
          <div className="text-sm font-bold font-mono text-[#3fb950]">Loss = {model2Loss.toFixed(2)}</div>
          <div className="w-full h-2 rounded bg-[#161b22] overflow-hidden">
            <div className="h-full bg-[#3fb950] transition-all" style={{ width: `${Math.min(100, model2Loss * 2)}%` }} />
          </div>
          <span className="text-[10px] text-[#3fb950] block">🚀 Быстро и стабильно сходится на дно чаши!</span>
        </div>

        {/* Model 3: Huge */}
        <div className="p-3 rounded-lg bg-[#0d1117] border border-[#f85149] space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#f85149] font-bold">3. Слишком большой (α = 0.5):</span>
          </div>
          <div className="text-sm font-bold font-mono text-[#f85149]">Loss = {model3Loss.toFixed(0)}</div>
          <div className="w-full h-2 rounded bg-[#161b22] overflow-hidden">
            <div className="h-full bg-[#f85149] transition-all" style={{ width: `${Math.min(100, model3Loss * 2)}%` }} />
          </div>
          <span className="text-[10px] text-[#f85149] block">💥 Перепрыгивает минимум, ошибка взрывается.</span>
        </div>
      </div>

      <button
        onClick={() => setIsRacing(true)}
        disabled={isRacing || epoch >= 40}
        className="w-full py-2 rounded bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 text-white font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        <span>Запустить гонку 3-х моделей (Эпоха {epoch}/40)</span>
      </button>
    </div>
  );
};
