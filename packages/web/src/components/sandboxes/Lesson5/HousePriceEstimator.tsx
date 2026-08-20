import React, { useState } from 'react';
import { Home } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const HousePriceEstimator: React.FC = () => {
  const [area, setArea] = useState<number>(60); // m^2

  // 1-feature regression model: Price = 120_000 * area + 500_000 rubles
  const priceRubles = 120000 * area + 500000;
  const priceMillions = (priceRubles / 1000000).toFixed(2);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Жизненный пример (1 Признак)
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Оценка цены квартиры по площади (м²)</h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#3fb950] bg-[#0d1117] px-3 py-1 rounded border border-[#30363d]">
          {priceMillions} млн ₽
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-48 h-36 rounded-lg bg-[#0d1117] border border-[#30363d] flex flex-col items-center justify-center p-3 text-center flex-shrink-0">
          <Home className="w-8 h-8 text-[#58a6ff] mb-1" />
          <span className="text-xs font-bold text-[#f0f6fc]">{area} м²</span>
          <span className="text-[10px] font-mono text-[#8b949e]">120 тыс. ₽ за м²</span>
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Площадь квартиры (x):</span>
              <span className="text-[#58a6ff] font-bold">{area} м²</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={area}
              onChange={e => setArea(Number(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] text-center font-mono text-xs">
            <FormulaView latex={`\\text{Цена } y = 120\\,000 \\cdot ${area} + 500\\,000 = ${priceRubles.toLocaleString('ru-RU')}\\text{ ₽}`} displayMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
