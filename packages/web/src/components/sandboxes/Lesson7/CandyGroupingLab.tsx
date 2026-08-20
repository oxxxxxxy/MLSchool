import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { MathText } from '../../math/MathText';

interface CandyItem {
  id: number;
  emoji: string;
  type: 'chocolate' | 'gummy' | 'lollipop';
  color: string;
}

const CANDIES: CandyItem[] = [
  { id: 1, emoji: '🍫', type: 'chocolate', color: '#d29922' },
  { id: 2, emoji: '🍫', type: 'chocolate', color: '#d29922' },
  { id: 3, emoji: '🍫', type: 'chocolate', color: '#d29922' },
  { id: 4, emoji: '🍬', type: 'lollipop', color: '#58a6ff' },
  { id: 5, emoji: '🍬', type: 'lollipop', color: '#58a6ff' },
  { id: 6, emoji: '🍬', type: 'lollipop', color: '#58a6ff' },
  { id: 7, emoji: '🐻', type: 'gummy', color: '#3fb950' },
  { id: 8, emoji: '🐻', type: 'gummy', color: '#3fb950' },
  { id: 9, emoji: '🐻', type: 'gummy', color: '#3fb950' }
];

export const CandyGroupingLab: React.FC = () => {
  const [isSorted, setIsSorted] = useState<boolean>(false);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Наглядная интуиция
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Сортировка сладостей без учителя</h3>
        </div>

        <button
          onClick={() => setIsSorted(!isSorted)}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors border ${
            isSorted
              ? 'bg-[#238636] text-white border-[#2ea043]'
              : 'bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]'
          }`}
        >
          {isSorted ? 'Сгруппировано по 3 кучкам' : 'Разложить по кучкам ✨'}
        </button>
      </div>

      <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d]">
        {!isSorted ? (
          <div className="flex flex-wrap justify-center gap-3 py-6">
            {CANDIES.map(c => (
              <div key={c.id} className="w-12 h-12 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-center text-2xl animate-pulse">
                {c.emoji}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-[#d29922]/10 border border-[#d29922]/40 text-center space-y-2">
              <span className="text-xs font-mono font-bold text-[#d29922] block">Кучка 1: Шоколад 🍫</span>
              <div className="flex justify-center gap-2">
                <span className="text-2xl">🍫</span>
                <span className="text-2xl">🍫</span>
                <span className="text-2xl">🍫</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#58a6ff]/10 border border-[#58a6ff]/40 text-center space-y-2">
              <span className="text-xs font-mono font-bold text-[#58a6ff] block">Кучка 2: Леденцы 🍬</span>
              <div className="flex justify-center gap-2">
                <span className="text-2xl">🍬</span>
                <span className="text-2xl">🍬</span>
                <span className="text-2xl">🍬</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#3fb950]/10 border border-[#3fb950]/40 text-center space-y-2">
              <span className="text-xs font-mono font-bold text-[#3fb950] block">Кучка 3: Мармеладки 🐻</span>
              <div className="flex justify-center gap-2">
                <span className="text-2xl">🐻</span>
                <span className="text-2xl">🐻</span>
                <span className="text-2xl">🐻</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-[#8b949e] leading-relaxed">
        Кластеризация похожа на раскладывание перемешанных сладостей: ты не знаешь их точных названий, но сам видишь похожие признаки и делишь их на группы.
      </p>
    </div>
  );
};
