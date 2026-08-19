import React, { useState } from 'react';
import { AlertTriangle, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';

export const BreakTheMachine: React.FC = () => {
  const [xVal, setXVal] = useState<number>(1.0);

  const isDangerous = Math.abs(xVal) < 0.1;
  const isZero = xVal === 0;
  const output = isZero ? Infinity : 10 / xVal;

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div>
        <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
          Интерактивный эксперимент 3
        </span>
        <h3 className="text-lg font-bold text-white">⚠️ Сломай автомат делением на 0!</h3>
        <p className="text-xs text-slate-400 mt-1">
          Исследуй функцию гиперболы <FormulaView latex="y = \frac{10}{x}" /> и приближай $x$ к нулю.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-1/2 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400">Значение делителя X:</span>
              <span className={`font-mono text-sm ${isDangerous ? 'text-rose-400 animate-pulse' : 'text-indigo-300'}`}>
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
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-3.0 (Безопасно)</span>
              <span className="text-rose-400 font-bold">0.0 (Опасная зона 💥)</span>
              <span>+3.0 (Безопасно)</span>
            </div>
          </div>

          {/* Machine Reactor Status */}
          <div className={`p-5 rounded-2xl border flex-1 text-center transition-all duration-300 ${
            isDangerous
              ? 'bg-rose-950/60 border-rose-500 shadow-lg shadow-rose-500/30 animate-pulse'
              : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="flex items-center justify-center gap-2">
              {isDangerous ? (
                <Flame className="w-6 h-6 text-rose-400 animate-bounce" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-indigo-400" />
              )}
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {isDangerous ? 'ПЕРЕГРУЗКА РЕАКТОРА!' : 'Статус конвейера: Норма'}
              </span>
            </div>

            <div className="mt-3">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Результат y = 10 / x:</span>
              <div className={`text-2xl font-black font-mono mt-0.5 ${
                isDangerous ? 'text-rose-300' : 'text-emerald-400'
              }`}>
                {isZero ? 'ОШИБКА: ДЕЛЕНИЕ НА 0 💥' : output.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Вывод для Дата-Сайентиста:</strong> Когда $x$ приближается к нулю, $y$ устремляется в космическую бесконечность! Точка $x = 0$ не входит в область определения $D(f)$. В машинном обучении перед обучением данные всегда фильтруют, чтобы в модели не возникало подобных аварий.
          </div>
        </div>
      </div>
    </div>
  );
};
