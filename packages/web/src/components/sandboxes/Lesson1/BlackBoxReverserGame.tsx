import React, { useState } from 'react';
import { Brain, Sparkles, Trophy, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FormulaView } from '../../math/FormulaView';

interface MysteryProblem {
  id: number;
  secretFn: (x: number) => number;
  secretLatex: string;
  options: string[];
  correctIndex: number;
  hint: string;
}

const PROBLEMS: MysteryProblem[] = [
  {
    id: 1,
    secretFn: (x: number) => 3 * x,
    secretLatex: 'f(x) = 3x',
    options: ['f(x) = 2x', 'f(x) = 3x', 'f(x) = x + 3', 'f(x) = x^2'],
    correctIndex: 1,
    hint: 'Посмотри, во сколько раз увеличивается входное число 2 или 4.'
  },
  {
    id: 2,
    secretFn: (x: number) => 2 * x + 1,
    secretLatex: 'f(x) = 2x + 1',
    options: ['f(x) = 2x - 1', 'f(x) = 3x', 'f(x) = 2x + 1', 'f(x) = x + 2'],
    correctIndex: 2,
    hint: 'При входе x = 0 автомат выдает 1, а при x = 3 выдает 7.'
  },
  {
    id: 3,
    secretFn: (x: number) => x * x - 1,
    secretLatex: 'f(x) = x^2 - 1',
    options: ['f(x) = 2x - 1', 'f(x) = x^2 - 1', 'f(x) = (x-1)^2', 'f(x) = x^2 + 1'],
    correctIndex: 1,
    hint: 'При x = 3 выход 8, при x = 4 выход 15. Это квадрат минус 1!'
  }
];

export const BlackBoxReverserGame: React.FC = () => {
  const [problemIndex, setProblemIndex] = useState(0);
  const [testInput, setTestInput] = useState<number>(2);
  const [history, setHistory] = useState<{ x: number; y: number }[]>([
    { x: 2, y: PROBLEMS[0].secretFn(2) }
  ]);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [stars, setStars] = useState(0);

  const currentProblem = PROBLEMS[problemIndex];

  const handleTestNumber = (num: number) => {
    const res = currentProblem.secretFn(num);
    setHistory(prev => [{ x: num, y: res }, ...prev.slice(0, 4)]);
  };

  const handleGuess = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);
    if (idx === currentProblem.correctIndex) {
      setStars(prev => prev + 1);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
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
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Мини-игра: Реверс-Инжиниринг ИИ
          </span>
          <h3 className="text-lg font-bold text-white">Взломщик Правил Чёрного Ящика</h3>
        </div>

        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-amber-400 font-bold text-xs">
          <Trophy className="w-4 h-4" />
          <span>Звёзд: {stars} / {PROBLEMS.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Interactive Testing Machine */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <span className="text-xs font-bold text-indigo-300 block">
            1. Отправь тестовые числа в ящик:
          </span>

          <div className="flex gap-2">
            {[-2, 0, 1, 3, 5, 10].map(num => (
              <button
                key={num}
                onClick={() => handleTestNumber(num)}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white font-mono font-bold text-xs border border-slate-800 transition-colors"
              >
                x={num}
              </button>
            ))}
          </div>

          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] uppercase font-bold text-slate-500">История испытаний автомата:</span>
            <div className="space-y-1">
              {history.map((h, i) => (
                <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs font-mono">
                  <span className="text-indigo-400">Вход: x = {h.x}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-emerald-400 font-bold">Выход: y = {h.y}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Guess the rule */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <span className="text-xs font-bold text-amber-300 block">
            2. Какая формула спрятана внутри? (Уровень {problemIndex + 1}/{PROBLEMS.length})
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            {currentProblem.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              let style = 'bg-slate-900/80 border-slate-800 hover:border-indigo-500 text-slate-200';
              if (isAnswered) {
                if (idx === currentProblem.correctIndex) {
                  style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected) {
                  style = 'bg-rose-950/60 border-rose-500 text-rose-200';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleGuess(idx)}
                  className={`p-3.5 rounded-xl border text-sm font-mono text-center transition-all ${style}`}
                >
                  <FormulaView latex={opt} />
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="pt-2 space-y-3">
              <div className={`p-3 rounded-xl text-xs font-medium ${
                selectedOpt === currentProblem.correctIndex
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
              }`}>
                {selectedOpt === currentProblem.correctIndex
                  ? `🎉 Правильно! Формула действительно ${currentProblem.secretLatex}`
                  : `Упс! Правильный ответ был: ${currentProblem.secretLatex}`}
              </div>

              {problemIndex + 1 < PROBLEMS.length && (
                <button
                  onClick={handleNextProblem}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  Следующий ящик →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
