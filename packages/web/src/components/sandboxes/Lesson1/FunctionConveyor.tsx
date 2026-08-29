import React, { useState } from 'react';
import { ArrowRight, Play, RefreshCw, Cpu } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

type RuleKey = 'x+3' | '2x' | '2x+1' | 'x^2' | '10/x';

export const FunctionConveyor: React.FC = () => {
  const [selectedRule, setSelectedRule] = useState<RuleKey>('2x+1');
  const [inputVal, setInputVal] = useState<number>(4);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<{ x: number; y: number | string }>>([
    { x: 1, y: 3 },
    { x: 2, y: 5 },
    { x: 3, y: 7 },
    { x: 4, y: 9 }
  ]);

  const computeY = (x: number, rule: RuleKey): number | string => {
    switch (rule) {
      case 'x+3': return x + 3;
      case '2x': return 2 * x;
      case '2x+1': return 2 * x + 1;
      case 'x^2': return x * x;
      case '10/x': return x === 0 ? 'Ошибка (деление на 0)' : Number((10 / x).toFixed(2));
    }
  };

  const getStepText = (x: number, rule: RuleKey): string => {
    switch (rule) {
      case 'x+3': return `${x} + 3 = ${x + 3}`;
      case '2x': return `${x} × 2 = ${2 * x}`;
      case '2x+1': return `${x} × 2 = ${2 * x} ➔ ${2 * x} + 1 = ${2 * x + 1}`;
      case 'x^2': return `${x} × ${x} = ${x * x}`;
      case '10/x': return x === 0 ? '10 / 0 = Ошибка!' : `10 / ${x} = ${(10 / x).toFixed(2)}`;
    }
  };

  const currentY = computeY(inputVal, selectedRule);
  const stepCalculation = getStepText(inputVal, selectedRule);

  const handleRun = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setHistory(prev => {
        const next = [...prev.filter(item => item.x !== inputVal), { x: inputVal, y: currentY }];
        return next.sort((a, b) => a.x - b.x).slice(-6);
      });
    }, 350);
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Интерактив: Магический Конвейер</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Вход x ➔ Правило f(x) ➔ Выход y</h3>
        </div>
        <div className="flex flex-wrap gap-1 bg-[#0d1117] p-1 rounded-md border border-[#30363d] text-xs font-mono">
          {(['x+3', '2x', '2x+1', 'x^2', '10/x'] as RuleKey[]).map(r => (
            <button
              key={r}
              onClick={() => {
                setSelectedRule(r);
                setHistory([1, 2, 3, 4].map(x => ({ x, y: computeY(x, r) })));
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedRule === r ? 'bg-[#21262d] text-[#58a6ff] font-bold border border-[#30363d]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              f(x) = {r}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Section Conveyor Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        {/* Left: Input Ball */}
        <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] text-center space-y-3">
          <span className="text-[10px] font-mono text-[#8b949e] uppercase block">1. Входной шар (x)</span>
          <div className="w-14 h-14 mx-auto rounded-full bg-[#58a6ff]/20 border-2 border-[#58a6ff] flex items-center justify-center text-lg font-bold text-[#58a6ff] shadow-md shadow-[#58a6ff]/10">
            {inputVal}
          </div>
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="8"
              step="1"
              value={inputVal}
              onChange={e => setInputVal(Number(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
            <span className="text-xs font-mono text-[#8b949e]">x = {inputVal}</span>
          </div>
        </div>

        {/* Center: Machine Rule Processing */}
        <div className="p-4 rounded-lg bg-[#161b22] border-2 border-[#30363d] text-center space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-[#d29922]">
            <Cpu className="w-4 h-4" />
            <span>2. Автомат: f(x) = {selectedRule}</span>
          </div>

          <div className={`py-3 px-2 rounded bg-[#0d1117] border border-[#30363d] font-mono text-xs text-[#f0f6fc] transition-all duration-200 ${
            isProcessing ? 'scale-105 border-[#58a6ff] text-[#58a6ff]' : ''
          }`}>
            {stepCalculation}
          </div>

          <button
            onClick={handleRun}
            className="w-full py-1.5 px-3 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Прогнать через конвейер</span>
          </button>
        </div>

        {/* Right: Output Ball */}
        <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] text-center space-y-3">
          <span className="text-[10px] font-mono text-[#8b949e] uppercase block">3. Выходной результат (y)</span>
          <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-lg font-bold shadow-md transition-all duration-300 ${
            typeof currentY === 'string'
              ? 'bg-[#f85149]/20 border-2 border-[#f85149] text-[#f85149] text-xs px-1'
              : 'bg-[#3fb950]/20 border-2 border-[#3fb950] text-[#3fb950] shadow-[#3fb950]/10'
          }`}>
            {typeof currentY === 'string' ? '💥 Error' : currentY}
          </div>
          <span className="text-xs font-mono text-[#3fb950] block">
            {typeof currentY === 'string' ? 'Не определен' : `y = ${currentY}`}
          </span>
        </div>
      </div>

      {/* Dynamic Results Table */}
      <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2">
        <span className="text-[11px] font-mono text-[#8b949e] uppercase block">Автоматическая таблица значений:</span>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-center">
            <thead>
              <tr className="border-b border-[#21262d] text-[#8b949e]">
                <th className="py-1 px-3">Вход x</th>
                {history.map((row, idx) => (
                  <td key={idx} className="py-1 px-3 text-[#58a6ff] font-bold">{row.x}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="py-1 px-3 text-[#8b949e]">Выход f(x)</th>
                {history.map((row, idx) => (
                  <td key={idx} className="py-1 px-3 text-[#3fb950] font-bold">{row.y}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
