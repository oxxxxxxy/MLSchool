import React, { useState, useEffect } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';
import { Car } from 'lucide-react';

export const TaxiMeterSimulator: React.FC = () => {
  const [km, setKm] = useState<number>(6);
  const [costPerKm, setCostPerKm] = useState<number>(30);
  const [boardingFee, setBoardingFee] = useState<number>(100);
  const [roadOffset, setRoadOffset] = useState<number>(0);

  const totalPrice = boardingFee + costPerKm * km;

  // Road animation
  useEffect(() => {
    let animId: number;
    const loop = () => {
      setRoadOffset(prev => (prev + 1.5) % 40);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const carProgressPercent = Math.min(100, Math.max(0, (km / 20) * 100));

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Эксперимент 2
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Такси-Калькулятор: y = kx + b в реальной жизни</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#d29922] bg-[#0d1117] px-3 py-1 rounded border border-[#30363d] animate-pulse">
            Итого: {totalPrice} ₽
          </span>
        </div>
      </div>

      {/* Animated Road Track */}
      <div className="relative h-20 rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden flex items-center px-4">
        {/* Moving road stripes */}
        <div
          className="absolute inset-x-0 h-1 top-1/2 -translate-y-1/2 flex gap-4 opacity-40"
          style={{ transform: `translateX(-${roadOffset}px)` }}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="w-6 h-1 bg-[#8b949e] flex-shrink-0" />
          ))}
        </div>

        {/* Moving Taxi Car */}
        <div
          className="absolute transition-all duration-300 ease-out flex items-center gap-1.5"
          style={{ left: `calc(${carProgressPercent}% * 0.82 + 10px)` }}
        >
          <div className="relative p-2 rounded-lg bg-[#d29922] text-[#0d1117] shadow-lg shadow-[#d29922]/20">
            <Car className="w-5 h-5 animate-bounce" />
            <div className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-[#f0f6fc] text-[#0d1117] text-[8px] font-mono font-bold rounded">
              TAXI
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#58a6ff] bg-[#161b22] px-1.5 py-0.5 rounded border border-[#30363d]">
            {km} км
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#8b949e]">Расстояние (x):</span>
            <span className="text-[#58a6ff] font-semibold">{km} км</span>
          </div>
          <input type="range" min="0" max="20" value={km} onChange={e => setKm(Number(e.target.value))} className="w-full accent-[#58a6ff] cursor-pointer" />
        </div>

        <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#8b949e]">Тариф за 1 км (k):</span>
            <span className="text-[#58a6ff] font-semibold">{costPerKm} ₽</span>
          </div>
          <input type="range" min="10" max="80" step="5" value={costPerKm} onChange={e => setCostPerKm(Number(e.target.value))} className="w-full accent-[#58a6ff] cursor-pointer" />
        </div>

        <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#8b949e]">Посадка (b):</span>
            <span className="text-[#d29922] font-semibold">{boardingFee} ₽</span>
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
