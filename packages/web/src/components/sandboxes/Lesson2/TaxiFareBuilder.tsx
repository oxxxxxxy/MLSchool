import React, { useState } from 'react';
import { Car } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const TaxiFareBuilder: React.FC = () => {
  const [basePrice, setBasePrice] = useState<number>(100); // b
  const [kmRate, setKmRate] = useState<number>(30); // k
  const [km, setKm] = useState<number>(7); // x

  const totalPrice = kmRate * km + basePrice;

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#d29922] uppercase">Интерактив: Собери тариф</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Такси-калькулятор как прямая линия y = kx + b</h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#3fb950] bg-[#0d1117] px-3 py-1 rounded border border-[#30363d]">
          Итого: {totalPrice} ₽
        </span>
      </div>

      {/* Visual Car Road */}
      <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2 relative overflow-hidden">
        <div className="relative h-12 flex items-center">
          {/* Road line */}
          <div className="w-full h-1 bg-[#21262d] absolute" />
          <div
            className="absolute -translate-y-1/2 top-1/2 transition-all duration-200 flex items-center gap-1.5"
            style={{ left: `${Math.min(88, Math.max(5, (km / 20) * 100))}%` }}
          >
            <Car className="w-7 h-7 text-[#d29922]" />
            <span className="text-[10px] font-mono text-[#58a6ff] bg-[#161b22] px-1.5 py-0.5 rounded border border-[#30363d]">
              {km} км
            </span>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#8b949e]">Посадка (b):</span>
            <span className="text-[#d29922] font-bold">{basePrice} ₽</span>
          </div>
          <input type="range" min="50" max="250" step="10" value={basePrice} onChange={e => setBasePrice(Number(e.target.value))} className="w-full accent-[#d29922] cursor-pointer" />
        </div>

        <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#8b949e]">Тариф за км (k):</span>
            <span className="text-[#58a6ff] font-bold">{kmRate} ₽/км</span>
          </div>
          <input type="range" min="15" max="60" step="5" value={kmRate} onChange={e => setKmRate(Number(e.target.value))} className="w-full accent-[#58a6ff] cursor-pointer" />
        </div>

        <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#8b949e]">Дистанция (x):</span>
            <span className="text-[#3fb950] font-bold">{km} км</span>
          </div>
          <input type="range" min="1" max="20" step="1" value={km} onChange={e => setKm(Number(e.target.value))} className="w-full accent-[#3fb950] cursor-pointer" />
        </div>
      </div>

      <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] text-center font-mono text-xs">
        <FormulaView latex={`\\text{Цена } y = ${kmRate} \\cdot ${km} + ${basePrice} = ${totalPrice}\\text{ ₽}`} displayMode={true} />
        <span className="text-[#8b949e] text-[11px] block mt-1">Точка на графике: ({km}, {totalPrice})</span>
      </div>
    </div>
  );
};
