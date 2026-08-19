import React, { useState } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const TaxiMeterSimulator: React.FC = () => {
  const [km, setKm] = useState<number>(5);
  const [costPerKm, setCostPerKm] = useState<number>(30);
  const [boardingFee, setBoardingFee] = useState<number>(100);

  const totalPrice = boardingFee + costPerKm * km;

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Эксперимент 2
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Такси-Калькулятор: Линейная зависимость</h3>
        </div>
        <span className="text-xs font-mono font-semibold text-[#d29922] bg-[#0d1117] px-2.5 py-1 rounded border border-[#30363d]">
          {totalPrice} ₽
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#8b949e]">Расстояние (x):</span>
            <span className="text-[#58a6ff]">{km} км</span>
          </div>
          <input type="range" min="0" max="20" value={km} onChange={e => setKm(Number(e.target.value))} className="w-full accent-[#58a6ff] cursor-pointer" />
        </div>

        <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#8b949e]">Тариф за 1 км (k):</span>
            <span className="text-[#58a6ff]">{costPerKm} ₽</span>
          </div>
          <input type="range" min="10" max="80" step="5" value={costPerKm} onChange={e => setCostPerKm(Number(e.target.value))} className="w-full accent-[#58a6ff] cursor-pointer" />
        </div>

        <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#8b949e]">Посадка (b):</span>
            <span className="text-[#d29922]">{boardingFee} ₽</span>
          </div>
          <input type="range" min="0" max="300" step="20" value={boardingFee} onChange={e => setBoardingFee(Number(e.target.value))} className="w-full accent-[#d29922] cursor-pointer" />
        </div>
      </div>

      <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] text-center font-mono text-xs text-[#c9d1d9]">
        <FormulaView latex={`y = ${costPerKm}x + ${boardingFee} \\implies y = ${costPerKm} \\cdot ${km} + ${boardingFee} = ${totalPrice}\\text{ руб}`} displayMode={true} />
      </div>
    </div>
  );
};
