import React, { useState } from 'react';
import { Car, DollarSign, MapPin, Gauge } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';

export const TaxiMeterSimulator: React.FC = () => {
  const [km, setKm] = useState<number>(5);
  const [costPerKm, setCostPerKm] = useState<number>(30); // k
  const [boardingFee, setBoardingFee] = useState<number>(100); // b

  const totalPrice = boardingFee + costPerKm * km;

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Интерактивный эксперимент 2
          </span>
          <h3 className="text-lg font-bold text-white">🚖 Такси-Калькулятор: Линейная функция в жизни</h3>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold text-xs">
          <DollarSign className="w-4 h-4" />
          <span>К оплате: {totalPrice} ₽</span>
        </div>
      </div>

      {/* Road & Taxi Simulation Visual */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
        <div className="relative h-20 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex items-center px-4">
          {/* Road markings */}
          <div className="absolute inset-x-0 h-0.5 border-b-2 border-dashed border-slate-700 top-1/2 -translate-y-1/2" />

          {/* Animated Taxi car */}
          <div
            className="relative z-10 transition-all duration-300 flex flex-col items-center"
            style={{ left: `${Math.min(90, (km / 20) * 90)}%` }}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/30">
              <Car className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-amber-400 mt-1 font-mono">{km} км</span>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                Расстояние x:
              </span>
              <span className="text-indigo-400 font-mono">{km} км</span>
            </div>
            <input type="range" min="0" max="20" value={km} onChange={e => setKm(Number(e.target.value))} className="w-full accent-indigo-500" />
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-sky-400" />
                Тариф за 1 км (k):
              </span>
              <span className="text-sky-400 font-mono">{costPerKm} ₽</span>
            </div>
            <input type="range" min="10" max="80" step="5" value={costPerKm} onChange={e => setCostPerKm(Number(e.target.value))} className="w-full accent-sky-500" />
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                Посадка (b):
              </span>
              <span className="text-amber-400 font-mono">{boardingFee} ₽</span>
            </div>
            <input type="range" min="0" max="300" step="20" value={boardingFee} onChange={e => setBoardingFee(Number(e.target.value))} className="w-full accent-amber-500" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-center space-y-2">
          <span className="text-xs font-bold text-slate-300">Математическая формула поездки:</span>
          <div className="text-xl font-black text-white font-mono">
            <FormulaView latex={`y = ${costPerKm} \\cdot x + ${boardingFee} \\implies y = ${costPerKm} \\cdot ${km} + ${boardingFee} = ${totalPrice}\\text{ руб}`} displayMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
