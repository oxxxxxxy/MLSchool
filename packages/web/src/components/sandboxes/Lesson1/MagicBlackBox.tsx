import React, { useState } from 'react';
import { Cog, ArrowDown, Sparkles, RefreshCw } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';

export const MagicBlackBox: React.FC = () => {
  const [rule, setRule] = useState<'double' | 'square' | 'shift' | 'custom'>('double');
  const [inputVal, setInputVal] = useState<number>(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputVal, setOutputVal] = useState<number | null>(6);

  const calculateOutput = (x: number, currentRule: string): number => {
    switch (currentRule) {
      case 'double': return x * 2;
      case 'square': return x * x;
      case 'shift': return x + 5;
      case 'custom': return 3 * x - 2;
      default: return x;
    }
  };

  const handleDropBall = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setOutputVal(calculateOutput(inputVal, rule));
      setIsProcessing(false);
    }, 500);
  };

  const ruleFormulas: Record<string, { label: string; formula: string; desc: string }> = {
    double: { label: 'Удвоитель', formula: 'f(x) = 2x', desc: 'Умножает входное число на 2' },
    square: { label: 'Квадратор', formula: 'f(x) = x^2', desc: 'Умножает входное число само на себя' },
    shift: { label: 'Сдвиг +5', formula: 'f(x) = x + 5', desc: 'Прибавляет 5 к входному числу' },
    custom: { label: 'Магический закон', formula: 'f(x) = 3x - 2', desc: 'Умножает на 3 и вычитает 2' }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Интерактивный эксперимент 1
          </span>
          <h3 className="text-lg font-bold text-white">Магический Конвейер Функций</h3>
        </div>

        {/* Rule selector buttons */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {Object.entries(ruleFormulas).map(([key, item]) => (
            <button
              key={key}
              onClick={() => {
                setRule(key as any);
                setOutputVal(calculateOutput(inputVal, key));
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                rule === key
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Machine Visual Stage */}
      <div className="relative py-8 px-4 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 flex flex-col items-center justify-center min-h-[300px]">
        {/* Input Ball Section */}
        <div className="flex flex-col items-center space-y-2">
          <span className="text-xs font-bold text-indigo-300">Входной аргумент: x = {inputVal}</span>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="-10"
              max="10"
              value={inputVal}
              onChange={(e) => {
                const val = Number(e.target.value);
                setInputVal(val);
                setOutputVal(calculateOutput(val, rule));
              }}
              className="w-48 accent-indigo-500 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-400 text-white font-extrabold text-sm flex items-center justify-center shadow-lg shadow-indigo-500/40 animate-bounce-soft">
              {inputVal}
            </div>
          </div>
        </div>

        {/* Dropping Arrow */}
        <div className="my-3 text-indigo-400 animate-pulse">
          <ArrowDown className="w-6 h-6" />
        </div>

        {/* The Black Box / Machine */}
        <div className={`relative w-72 p-5 rounded-2xl bg-gradient-to-tr from-indigo-950 via-slate-900 to-purple-950 border-2 border-indigo-500/50 text-center shadow-2xl transition-all duration-300 ${
          isProcessing ? 'scale-105 border-indigo-400 shadow-indigo-500/30' : ''
        }`}>
          <div className="absolute -top-3 left-4 px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-black rounded-md uppercase tracking-wider">
            Автомат f(x)
          </div>

          <div className="flex items-center justify-center gap-3 my-2">
            <Cog className={`w-8 h-8 text-indigo-400 ${isProcessing ? 'animate-spin' : ''}`} />
            <div className="text-lg font-black text-white">
              <FormulaView latex={ruleFormulas[rule].formula} />
            </div>
            <Cog className={`w-6 h-6 text-purple-400 ${isProcessing ? 'animate-spin' : ''}`} />
          </div>
          <p className="text-[11px] text-slate-400">{ruleFormulas[rule].desc}</p>
        </div>

        {/* Output Arrow */}
        <div className="my-3 text-emerald-400">
          <ArrowDown className="w-6 h-6" />
        </div>

        {/* Output Ball Section */}
        <div className="flex flex-col items-center space-y-2">
          <span className="text-xs font-bold text-emerald-400">Выход функции: y = f({inputVal})</span>
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-base flex items-center justify-center shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20">
            {outputVal !== null ? outputVal : '?'}
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
        <span>💡 <strong>Вывод:</strong> Меняя число на входе, автомат мгновенно выдает строго один результат по закону формулы.</span>
        <button
          onClick={handleDropBall}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex-shrink-0 ml-3"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Запустить конвейер
        </button>
      </div>
    </div>
  );
};
