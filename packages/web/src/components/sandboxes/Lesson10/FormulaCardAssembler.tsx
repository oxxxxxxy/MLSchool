import React, { useState } from 'react';
import { CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FormulaCardAssembler: React.FC = () => {
  const cards = ['2/n', 'Σ', 'error', '× x'];
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const targetSequence = ['2/n', 'Σ', 'error', '× x'];

  const handleAddCard = (card: string) => {
    if (selectedCards.includes(card) || isCompleted) return;
    const next = [...selectedCards, card];
    setSelectedCards(next);
    if (next.length === 4) {
      const isOk = next.every((val, idx) => val === targetSequence[idx]);
      if (isOk) {
        setIsCompleted(true);
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      }
    }
  };

  const handleReset = () => {
    setSelectedCards([]);
    setIsCompleted(false);
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Конструктор формул</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Собери формулу градиента по k: ∂L/∂k</h3>
        </div>
        <button onClick={handleReset} className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d]">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Assembly Area */}
      <div className="p-4 rounded-lg bg-[#0d1117] border-2 border-dashed border-[#30363d] min-h-[60px] flex items-center justify-center gap-2">
        <span className="font-mono text-sm font-bold text-[#58a6ff] mr-2">dk = </span>
        {selectedCards.length === 0 ? (
          <span className="text-xs font-mono text-[#8b949e]">Кликай по карточкам ниже, чтобы собрать формулу</span>
        ) : (
          selectedCards.map((c, idx) => (
            <div key={idx} className="px-3 py-1.5 rounded bg-[#21262d] border border-[#58a6ff] font-mono text-xs font-bold text-[#f0f6fc]">
              {c}
            </div>
          ))
        )}
      </div>

      {/* Card Pool */}
      <div className="flex flex-wrap gap-2 justify-center">
        {cards.map(c => {
          const isUsed = selectedCards.includes(c);
          return (
            <button
              key={c}
              disabled={isUsed || isCompleted}
              onClick={() => handleAddCard(c)}
              className={`px-4 py-2 rounded-lg border font-mono text-xs font-bold transition-all ${
                isUsed
                  ? 'bg-[#161b22] border-[#21262d] text-[#484f58] opacity-50'
                  : 'bg-[#0d1117] hover:bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:border-[#58a6ff]'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {isCompleted && (
        <div className="p-3 rounded-lg bg-[#238636]/15 border border-[#2ea043] text-xs font-mono text-[#3fb950] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>✨ Идеально! dk = (2/n) Σ(error × x). Градиент по наклону найден!</span>
        </div>
      )}
    </div>
  );
};
