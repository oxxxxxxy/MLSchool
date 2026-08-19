import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const BreakTheMachine: React.FC = () => {
  const [xVal, setXVal] = useState<number>(1.0);

  const isDangerous = Math.abs(xVal) < 0.1;
  const isZero = xVal === 0;
  const output = isZero ? Infinity : 10 / xVal;

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div>
        <span className="text-[11px] font-mono text-[#8b949e] uppercase">
          Эксперимент 3
        </span>
        <h3 className="text-sm font-semibold text-[#c9d1d9]">Область определения: Деление на ноль</h3>
      </div>

      <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#8b949e]">Делитель X:</span>
            <span className={isDangerous ? 'text-[#f85149] font-bold' : 'text-[#58a6ff] font-semibold'}>
              {xVal.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.05"
            value={xVal}
            onChange={(e) => setXVal(parseFloat(e.target.value))}
            className="w-full accent-[#58a6ff] cursor-pointer"
          />
        </div>

        <div className={`p-3 rounded-lg border text-center font-mono ${
          isDangerous ? 'bg-[#da3633]/15 border-[#f85149] text-[#f85149]' : 'bg-[#161b22] border-[#30363d] text-[#c9d1d9]'
        }`}>
          <span className="text-[10px] text-[#8b949e] block">Результат y = 10 / x</span>
          <div className="text-lg font-bold mt-0.5">
            {isZero ? 'Ошибка: Деление на 0' : output.toFixed(2)}
          </div>
        </div>

        <div className="text-xs text-[#8b949e] leading-relaxed">
          <MathText text="Когда делитель $x$ приближается к 0, результат $y$ устремляется в бесконечность. Точка $x = 0$ не входит в допустимые значения функции." />
        </div>
      </div>
    </div>
  );
};
