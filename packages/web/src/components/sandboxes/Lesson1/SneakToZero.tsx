import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const SneakToZero: React.FC = () => {
  const [xVal, setXVal] = useState<number>(1.0);

  const steps = [
    { label: 'x = 1', val: 1.0 },
    { label: 'x = 0.5', val: 0.5 },
    { label: 'x = 0.1', val: 0.1 },
    { label: 'x = 0.01', val: 0.01 },
    { label: 'x = 0 (Опасно!)', val: 0.0 }
  ];

  const isZero = xVal === 0.0;
  const resultY = isZero ? null : Number((10 / xVal).toFixed(2));

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#f85149] uppercase">Эксперимент: Запрещенные значения</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Подкрадись к нулю в формуле f(x) = 10 / x</h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#d29922] bg-[#0d1117] px-2.5 py-1 rounded border border-[#30363d]">
          f(x) = 10 / x
        </span>
      </div>

      {/* Preset Steps */}
      <div className="flex flex-wrap gap-1.5">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setXVal(s.val)}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors border ${
              xVal === s.val
                ? s.val === 0 ? 'bg-[#da3633] text-white border-[#f85149]' : 'bg-[#21262d] text-[#58a6ff] border-[#58a6ff] font-bold'
                : 'bg-[#0d1117] text-[#8b949e] border-[#30363d] hover:text-[#c9d1d9]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Result Card */}
      <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[#8b949e]">Текущий вход x: <strong className="text-[#58a6ff]">{xVal}</strong></span>
          <span className="text-xs font-mono text-[#8b949e]">
            Выход y: <strong className={isZero ? 'text-[#f85149]' : 'text-[#3fb950]'}>{isZero ? 'Не определён' : resultY}</strong>
          </span>
        </div>

        {isZero ? (
          <div className="p-3 rounded bg-[#da3633]/15 border border-[#f85149] text-xs font-mono text-[#f85149] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <div>
              <strong>Ошибка: деление на ноль!</strong> Для x = 0 функция не определена (это не бесконечность, результат просто не существует).
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded bg-[#161b22] border border-[#30363d] text-center font-mono text-sm text-[#f0f6fc]">
            <FormulaView latex={`f(${xVal}) = \\frac{10}{${xVal}} = ${resultY}`} displayMode={true} />
          </div>
        )}
      </div>
    </div>
  );
};
