import React, { useState } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';
import { Pizza } from 'lucide-react';

export const PizzaPricePredictor: React.FC = () => {
  const [diameter, setDiameter] = useState<number>(30); // cm
  const [toppings, setToppings] = useState<number>(2);

  // Linear Regression Model for Pizza: Base price + 18 * diameter + 45 * toppings
  const predictedPrice = Math.round(18 * diameter + 45 * toppings + 80);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Эксперимент 1
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Регрессия: Предсказание цены пиццы</h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#d29922] bg-[#0d1117] px-3 py-1 rounded border border-[#30363d]">
          Прогноз: {predictedPrice} ₽
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Pizza Visual Display */}
        <div className="relative w-full sm:w-56 h-48 rounded-lg bg-[#0d1117] border border-[#30363d] flex items-center justify-center flex-shrink-0">
          <div
            className="rounded-full bg-[#d29922]/20 border-2 border-[#d29922] flex items-center justify-center transition-all duration-200"
            style={{ width: `${diameter * 4.2}px`, height: `${diameter * 4.2}px` }}
          >
            <div className="text-center">
              <Pizza className="w-8 h-8 text-[#d29922] mx-auto opacity-80" />
              <span className="text-[10px] font-mono font-bold text-[#f0f6fc] block mt-1">
                {diameter} см
              </span>
            </div>
          </div>
          <span className="absolute bottom-2 left-2 text-[9px] font-mono text-[#8b949e]">
            {toppings} топпингов
          </span>
        </div>

        {/* Features Input */}
        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Признак 1: Диаметр пиццы (x₁):</span>
              <span className="text-[#58a6ff] font-semibold">{diameter} см</span>
            </div>
            <input
              type="range"
              min="20"
              max="45"
              step="1"
              value={diameter}
              onChange={e => setDiameter(Number(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Признак 2: Доп. ингредиенты (x₂):</span>
              <span className="text-[#3fb950] font-semibold">{toppings} шт</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={toppings}
              onChange={e => setToppings(Number(e.target.value))}
              className="w-full accent-[#3fb950] cursor-pointer"
            />
          </div>

          <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] text-center font-mono text-xs">
            <FormulaView latex={`\\text{Цена } y = 18 \\cdot ${diameter} + 45 \\cdot ${toppings} + 80 = ${predictedPrice}\\text{ руб}`} displayMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
