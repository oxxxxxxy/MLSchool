import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const ErrorCancellationLab: React.FC = () => {
  const [e1, setE1] = useState<number>(5.0);
  const [e2, setE2] = useState<number>(-5.0);

  const sumSigned = e1 + e2;
  const sumSquared = e1 * e1 + e2 * e2;

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#f85149] uppercase">Критическая проблема</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Почему нельзя просто сложить ошибки со знаком?</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#8b949e]">Ошибка точки 1 (e₁):</span>
            <span className="text-[#3fb950] font-bold">+{e1}</span>
          </div>
          <input type="range" min="1" max="10" step="1" value={e1} onChange={e => setE1(Number(e.target.value))} className="w-full accent-[#3fb950] cursor-pointer" />
        </div>

        <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#8b949e]">Ошибка точки 2 (e₂):</span>
            <span className="text-[#f85149] font-bold">{e2}</span>
          </div>
          <input type="range" min="-10" max="-1" step="1" value={e2} onChange={e => setE2(Number(e.target.value))} className="w-full accent-[#f85149] cursor-pointer" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Simple sum failure */}
        <div className="p-3 rounded-lg bg-[#da3633]/10 border border-[#f85149] space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between text-[#f85149] font-bold">
            <span>Сумма со знаками: Σe</span>
            <span>{sumSigned}</span>
          </div>
          <p className="text-[11px] text-[#8b949e]">
            {sumSigned === 0
              ? '❌ Ошибки (+5 и -5) взаимно уничтожили друг друга в ноль! Модель дважды сильно ошиблась, а сумма врет, что всё идеально.'
              : 'Ошибки разных знаков маскируют реальные промахи.'}
          </p>
        </div>

        {/* Squared sum success */}
        <div className="p-3 rounded-lg bg-[#238636]/10 border border-[#2ea043] space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between text-[#3fb950] font-bold">
            <span>Сумма квадратов: Σ(e²)</span>
            <span>{sumSquared}</span>
          </div>
          <p className="text-[11px] text-[#8b949e]">
            ✅ Квадрат уничтожает знак: 5² = 25 и (-5)² = 25. Итоговая ошибка = 50. Промахи честно суммируются!
          </p>
        </div>
      </div>
    </div>
  );
};
