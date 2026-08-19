import React, { useState } from 'react';
import { Cog, ArrowDown } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';

export const MagicBlackBox: React.FC = () => {
  const [rule, setRule] = useState<'double' | 'square' | 'shift' | 'custom'>('double');
  const [inputVal, setInputVal] = useState<number>(3);
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

  const ruleFormulas: Record<string, { label: string; formula: string; desc: string }> = {
    double: { label: '2x (Удвоитель)', formula: 'f(x) = 2x', desc: 'Умножает входное число на 2' },
    square: { label: 'x² (Квадратор)', formula: 'f(x) = x^2', desc: 'Возводит входное число в квадрат' },
    shift: { label: 'x + 5 (Сдвиг)', formula: 'f(x) = x + 5', desc: 'Прибавляет 5' },
    custom: { label: '3x - 2', formula: 'f(x) = 3x - 2', desc: 'Умножает на 3 и вычитает 2' }
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Эксперимент 1
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Конвейер функций: Вход → Автомат → Выход</h3>
        </div>

        {/* Rule selector buttons */}
        <div className="flex flex-wrap gap-1 bg-[#0d1117] p-1 rounded-md border border-[#30363d]">
          {Object.entries(ruleFormulas).map(([key, item]) => (
            <button
              key={key}
              onClick={() => {
                setRule(key as any);
                setOutputVal(calculateOutput(inputVal, key));
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                rule === key
                  ? 'bg-[#21262d] text-[#58a6ff] font-semibold border border-[#30363d]'
                  : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Machine Visual Stage */}
      <div className="py-6 px-4 rounded-lg bg-[#0d1117] border border-[#30363d] flex flex-col items-center justify-center space-y-3">
        {/* Input */}
        <div className="flex flex-col items-center space-y-1 text-center">
          <span className="text-xs font-mono text-[#8b949e]">Входной аргумент: x = {inputVal}</span>
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
              className="w-40 accent-[#58a6ff] cursor-pointer"
            />
            <div className="w-9 h-9 rounded-md bg-[#21262d] border border-[#30363d] text-[#58a6ff] font-mono font-bold text-xs flex items-center justify-center">
              {inputVal}
            </div>
          </div>
        </div>

        <ArrowDown className="w-4 h-4 text-[#8b949e]" />

        {/* The Black Box */}
        <div className="w-64 p-3.5 rounded-lg bg-[#161b22] border border-[#30363d] text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-sm font-mono text-[#f0f6fc]">
            <Cog className="w-4 h-4 text-[#8b949e]" />
            <FormulaView latex={ruleFormulas[rule].formula} />
            <Cog className="w-4 h-4 text-[#8b949e]" />
          </div>
          <p className="text-[11px] text-[#8b949e]">{ruleFormulas[rule].desc}</p>
        </div>

        <ArrowDown className="w-4 h-4 text-[#8b949e]" />

        {/* Output */}
        <div className="flex flex-col items-center space-y-1 text-center">
          <span className="text-xs font-mono text-[#8b949e]">Выход функции: y = f({inputVal})</span>
          <div className="w-10 h-10 rounded-md bg-[#238636]/20 border border-[#2ea043] text-[#3fb950] font-mono font-bold text-sm flex items-center justify-center">
            {outputVal !== null ? outputVal : '?'}
          </div>
        </div>
      </div>
    </div>
  );
};
