import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

interface DataRow {
  x: number;
  y: number;
  yHat?: number;
  error?: number;
  errorSq?: number;
}

export const MSEStepByStepCalc: React.FC = () => {
  const [step, setStep] = useState<number>(0);

  // Model: ŷ = 2x + 1
  const k = 2;
  const b = 1;

  const initialRows: DataRow[] = [
    { x: 1, y: 4 },
    { x: 2, y: 5 },
    { x: 3, y: 8 }
  ];

  const rows: DataRow[] = initialRows.map(r => {
    const yHat = k * r.x + b;
    const error = yHat - r.y;
    const errorSq = error * error;
    return {
      ...r,
      yHat: step >= 1 ? yHat : undefined,
      error: step >= 2 ? error : undefined,
      errorSq: step >= 3 ? errorSq : undefined
    };
  });

  const sumSq = (1 * 1) + (0 * 0) + (-1 * -1); // (-1)^2 + 0^2 + (-1)^2 = 1 + 0 + 1 = 2
  // For (1,4): ŷ=3, e=3-4=-1, e²=1
  // For (2,5): ŷ=5, e=5-5=0, e²=0
  // For (3,8): ŷ=7, e=7-8=-1, e²=1
  // sum = 1 + 0 + 1 = 2
  const finalMSE = (2 / 3).toFixed(2);

  const stepNames = [
    'Старт: Исходные данные (x, y)',
    'Шаг 1: Посчитать Predictions (ŷ = 2x + 1)',
    'Шаг 2: Посчитать Errors (e = ŷ - y)',
    'Шаг 3: Возвести в квадрат (e²)',
    'Шаг 4: Сложить все квадраты (Σe² = 2)',
    'Шаг 5: Разделить на количество точек n (MSE = 2/3 = 0.67)'
  ];

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Пошаговый расчет MSE</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">{stepNames[step]}</h3>
        </div>
        <button onClick={() => setStep(0)} className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d]">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive Table */}
      <div className="overflow-x-auto p-3 rounded-lg bg-[#0d1117] border border-[#30363d]">
        <table className="w-full text-xs font-mono text-center">
          <thead>
            <tr className="border-b border-[#21262d] text-[#8b949e]">
              <th className="py-2 px-3">Точка</th>
              <th className="py-2 px-3">Признак x</th>
              <th className="py-2 px-3 text-[#3fb950]">Факт y</th>
              <th className="py-2 px-3 text-[#58a6ff]">Прогноз ŷ</th>
              <th className="py-2 px-3 text-[#d29922]">Ошибка e = ŷ - y</th>
              <th className="py-2 px-3 text-[#f85149]">Квадрат e²</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-b border-[#161b22]">
                <td className="py-2 px-3 text-[#8b949e]">#{idx + 1}</td>
                <td className="py-2 px-3 font-bold">{r.x}</td>
                <td className="py-2 px-3 text-[#3fb950] font-bold">{r.y}</td>
                <td className="py-2 px-3 text-[#58a6ff] font-bold">{r.yHat !== undefined ? r.yHat : '—'}</td>
                <td className="py-2 px-3 text-[#d29922] font-bold">{r.error !== undefined ? r.error : '—'}</td>
                <td className="py-2 px-3 text-[#f85149] font-bold">{r.errorSq !== undefined ? r.errorSq : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formula & Summary */}
      {step >= 4 && (
        <div className="p-3 rounded-lg bg-[#161b22] border border-[#30363d] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div>
            <span className="text-[#8b949e]">Сумма квадратов ошибок: </span>
            <span className="text-[#f85149] font-bold">1 + 0 + 1 = 2</span>
          </div>
          {step >= 5 && (
            <div className="text-sm font-bold text-[#3fb950]">
              MSE = 2 / 3 = {finalMSE}
            </div>
          )}
        </div>
      )}

      {/* Step Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => setStep(prev => Math.min(5, prev + 1))}
          disabled={step === 5}
          className="w-full py-2 rounded bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 text-white font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
        >
          <span>{step === 5 ? '✅ Расчет полностью завершен' : 'Выполнить следующий шаг ➔'}</span>
        </button>
      </div>
    </div>
  );
};
