import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';
import confetti from 'canvas-confetti';

interface Scenario {
  x: number;
  fPrime: number;
  funcText: string;
  correctDir: 'left' | 'right';
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    x: 2.0,
    fPrime: 3.2,
    funcText: 'f(x) = x²',
    correctDir: 'left',
    explanation: 'Производная положительна (f\'(x) > 0), значит функция растет вправо. Чтобы уменьшить значение (пойти вниз), нужно идти влево (←)!'
  },
  {
    x: -3.0,
    fPrime: -4.5,
    funcText: 'f(x) = x²',
    correctDir: 'right',
    explanation: 'Производная отрицательна (f\'(x) < 0), функция падает вправо. Чтобы идти дальше вниз, нужно шагать вправо (→)!'
  },
  {
    x: 1.5,
    fPrime: 2.1,
    funcText: 'f(x) = 0.5x² + 1',
    correctDir: 'left',
    explanation: 'f\'(x) = +2.1 > 0 — график идет в гору. Спуск вниз находится слева (←)!'
  }
];

export const SlopeDirectionQuest: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const cur = SCENARIOS[idx];

  const handleChoice = (dir: 'left' | 'right') => {
    if (feedback) return;
    const isCorrect = dir === cur.correctDir;
    if (isCorrect) {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
      setFeedback({ isCorrect: true, text: `Верно! ${cur.explanation}` });
    } else {
      setFeedback({ isCorrect: false, text: `Не совсем. ${cur.explanation}` });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setIdx((idx + 1) % SCENARIOS.length);
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#d29922] uppercase">Интерактивный квест</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Куда идти вниз по знаку производной?</h3>
        </div>
        <span className="text-xs font-mono text-[#8b949e]">Задание {idx + 1} из {SCENARIOS.length}</span>
      </div>

      <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-3 text-center">
        <span className="text-xs font-mono text-[#8b949e] block">Спидометр наклона под ногами персонажа:</span>
        <div className="inline-block px-4 py-2 rounded-lg bg-[#161b22] border-2 border-[#58a6ff] font-mono text-base font-bold text-[#58a6ff]">
          f'(x) = {cur.fPrime > 0 ? `+${cur.fPrime}` : cur.fPrime}
        </div>
        <p className="text-xs text-[#8b949e]">
          В какую сторону нужно сделать шаг (<strong className="text-[#f0f6fc]">x</strong>), чтобы значение функции <strong className="text-[#3fb950]">уменьшилось</strong>?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          disabled={!!feedback}
          onClick={() => handleChoice('left')}
          className="py-3 px-4 rounded-lg bg-[#0d1117] hover:bg-[#21262d] disabled:opacity-50 border border-[#30363d] hover:border-[#58a6ff] text-xs font-mono font-bold text-[#c9d1d9] flex items-center justify-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#58a6ff]" />
          <span>Шаг Влево (x уменьшить)</span>
        </button>

        <button
          disabled={!!feedback}
          onClick={() => handleChoice('right')}
          className="py-3 px-4 rounded-lg bg-[#0d1117] hover:bg-[#21262d] disabled:opacity-50 border border-[#30363d] hover:border-[#3fb950] text-xs font-mono font-bold text-[#c9d1d9] flex items-center justify-center gap-2 transition-all"
        >
          <span>Шаг Вправо (x увеличить)</span>
          <ArrowRight className="w-4 h-4 text-[#3fb950]" />
        </button>
      </div>

      {feedback && (
        <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
          feedback.isCorrect ? 'bg-[#238636]/15 border-[#2ea043] text-[#3fb950]' : 'bg-[#da3633]/15 border-[#f85149] text-[#f85149]'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.isCorrect ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
            <span className="text-[#c9d1d9]">{feedback.text}</span>
          </div>
          <button onClick={handleNext} className="px-3 py-1 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-mono text-xs flex-shrink-0">
            Далее ➔
          </button>
        </div>
      )}
    </div>
  );
};
