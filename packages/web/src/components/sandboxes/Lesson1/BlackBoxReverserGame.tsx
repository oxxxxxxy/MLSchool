import React, { useState } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

interface MysteryProblem {
  id: number;
  secretFn: (x: number) => number;
  secretLatex: string;
  options: string[];
  correctIndex: number;
}

const PROBLEMS: MysteryProblem[] = [
  {
    id: 1,
    secretFn: (x: number) => 3 * x,
    secretLatex: 'f(x) = 3x',
    options: ['f(x) = 2x', 'f(x) = 3x', 'f(x) = x + 3', 'f(x) = x^2'],
    correctIndex: 1,
  },
  {
    id: 2,
    secretFn: (x: number) => 2 * x + 1,
    secretLatex: 'f(x) = 2x + 1',
    options: ['f(x) = 2x - 1', 'f(x) = 3x', 'f(x) = 2x + 1', 'f(x) = x + 2'],
    correctIndex: 2,
  }
];

export const BlackBoxReverserGame: React.FC = () => {
  const [problemIndex, setProblemIndex] = useState(0);
  const [history, setHistory] = useState<{ x: number; y: number }[]>([
    { x: 2, y: PROBLEMS[0].secretFn(2) }
  ]);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentProblem = PROBLEMS[problemIndex];

  const handleTestNumber = (num: number) => {
    const res = currentProblem.secretFn(num);
    setHistory(prev => [{ x: num, y: res }, ...prev.slice(0, 3)]);
  };

  const handleGuess = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);
    if (idx === currentProblem.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextProblem = () => {
    if (problemIndex + 1 < PROBLEMS.length) {
      const nextIdx = problemIndex + 1;
      setProblemIndex(nextIdx);
      setSelectedOpt(null);
      setIsAnswered(false);
      setHistory([{ x: 2, y: PROBLEMS[nextIdx].secretFn(2) }]);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Тренажер
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Взломщик правил: Угадай формулу</h3>
        </div>
        <span className="text-xs font-mono text-[#d29922]">Счет: {score}/{PROBLEMS.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Testing */}
        <div className="p-3.5 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-3">
          <span className="text-xs font-mono text-[#8b949e] block">1. Проверь тестовые числа:</span>
          <div className="flex flex-wrap gap-1.5">
            {[-2, 0, 1, 3, 5].map(num => (
              <button
                key={num}
                onClick={() => handleTestNumber(num)}
                className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs font-mono border border-[#30363d] transition-colors"
              >
                x={num}
              </button>
            ))}
          </div>

          <div className="space-y-1 pt-1">
            {history.map((h, i) => (
              <div key={i} className="flex justify-between items-center px-2 py-1 rounded bg-[#161b22] text-xs font-mono">
                <span className="text-[#8b949e]">Вход x = {h.x}</span>
                <span className="text-[#3fb950]">Выход y = {h.y}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Guess */}
        <div className="p-3.5 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-3">
          <span className="text-xs font-mono text-[#8b949e] block">2. Какая формула внутри?</span>
          <div className="grid grid-cols-2 gap-2">
            {currentProblem.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              let style = 'bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:border-[#8b949e]';
              if (isAnswered) {
                if (idx === currentProblem.correctIndex) {
                  style = 'bg-[#238636]/15 border-[#2ea043] text-[#3fb950] font-semibold';
                } else if (isSelected) {
                  style = 'bg-[#da3633]/15 border-[#f85149] text-[#f85149]';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleGuess(idx)}
                  className={`p-2 rounded text-xs font-mono border text-center transition-colors ${style}`}
                >
                  <FormulaView latex={opt} />
                </button>
              );
            })}
          </div>

          {isAnswered && problemIndex + 1 < PROBLEMS.length && (
            <button
              onClick={handleNextProblem}
              className="w-full py-1.5 rounded bg-[#1f6feb] hover:bg-[#388bfd] text-white font-mono text-xs transition-colors"
            >
              Следующее задание →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
