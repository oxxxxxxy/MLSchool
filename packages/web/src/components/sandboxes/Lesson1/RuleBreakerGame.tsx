import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Puzzle {
  examples: Array<{ x: number; y: number }>;
  correctRule: string;
  options: string[];
}

const PUZZLES: Puzzle[] = [
  {
    examples: [{ x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: 7 }],
    correctRule: '2x + 1',
    options: ['x + 2', '2x + 1', '3x', 'x²']
  },
  {
    examples: [{ x: 1, y: 4 }, { x: 2, y: 7 }, { x: 3, y: 10 }],
    correctRule: '3x + 1',
    options: ['3x + 1', '4x', '2x + 2', 'x + 3']
  },
  {
    examples: [{ x: 2, y: 4 }, { x: 3, y: 9 }, { x: 4, y: 16 }],
    correctRule: 'x²',
    options: ['2x', 'x + 2', 'x²', '3x - 2']
  }
];

export const RuleBreakerGame: React.FC = () => {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const current = PUZZLES[puzzleIdx];

  const handleSelect = (opt: string) => {
    setSelectedOption(opt);
    const correct = opt === current.correctRule;
    setIsCorrect(correct);
    if (correct) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setPuzzleIdx((puzzleIdx + 1) % PUZZLES.length);
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#d29922] uppercase">Мини-игра: Взломщик правил</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Угадай скрытую формулу по примерам</h3>
        </div>
        <span className="text-xs font-mono text-[#8b949e]">Загадка {puzzleIdx + 1} из {PUZZLES.length}</span>
      </div>

      {/* Examples Card */}
      <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2">
        <span className="text-[10px] font-mono text-[#8b949e] uppercase block">Примеры работы чёрного ящика:</span>
        <div className="flex flex-wrap gap-3 justify-center py-2">
          {current.examples.map((ex, idx) => (
            <div key={idx} className="px-3 py-1.5 rounded-md bg-[#161b22] border border-[#30363d] text-xs font-mono">
              <span className="text-[#58a6ff] font-bold">{ex.x}</span> ➔ <span className="text-[#3fb950] font-bold">{ex.y}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {current.options.map(opt => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            className={`p-3 rounded-lg border font-mono text-xs font-bold transition-all ${
              selectedOption === opt
                ? isCorrect
                  ? 'bg-[#238636]/20 border-[#2ea043] text-[#3fb950]'
                  : 'bg-[#da3633]/20 border-[#f85149] text-[#f85149]'
                : 'bg-[#0d1117] hover:bg-[#21262d] border-[#30363d] text-[#c9d1d9]'
            }`}
          >
            f(x) = {opt}
          </button>
        ))}
      </div>

      {/* Feedback Banner */}
      {isCorrect !== null && (
        <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
          isCorrect ? 'bg-[#238636]/15 border-[#2ea043] text-[#3fb950]' : 'bg-[#da3633]/15 border-[#f85149] text-[#f85149]'
        }`}>
          <div className="flex items-center gap-2">
            {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span>{isCorrect ? '✨ Правило разгадано идеально!' : 'Попробуй проверить другие варианты.'}</span>
          </div>
          {isCorrect && (
            <button
              onClick={handleNext}
              className="px-3 py-1 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-mono text-xs"
            >
              Следующая загадка ➔
            </button>
          )}
        </div>
      )}
    </div>
  );
};
