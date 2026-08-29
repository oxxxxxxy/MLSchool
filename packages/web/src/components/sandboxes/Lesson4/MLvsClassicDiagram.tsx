import React, { useState } from 'react';
import { Cpu, Sparkles, ArrowRight } from 'lucide-react';
import { MathText } from '../../math/MathText';

export const MLvsClassicDiagram: React.FC = () => {
  const [tab, setTab] = useState<'classic' | 'ml'>('ml');

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Сравнение парадигм</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Обычное программирование vs Машинное Обучение</h3>
        </div>
        <div className="flex gap-1 bg-[#0d1117] p-1 rounded-md border border-[#30363d] text-xs font-mono">
          <button
            onClick={() => setTab('classic')}
            className={`px-2.5 py-1 rounded transition-colors ${tab === 'classic' ? 'bg-[#21262d] text-[#c9d1d9] font-bold border border-[#30363d]' : 'text-[#8b949e]'}`}
          >
            Классическое
          </button>
          <button
            onClick={() => setTab('ml')}
            className={`px-2.5 py-1 rounded transition-colors ${tab === 'ml' ? 'bg-[#21262d] text-[#58a6ff] font-bold border border-[#30363d]' : 'text-[#8b949e]'}`}
          >
            Machine Learning ✨
          </button>
        </div>
      </div>

      {tab === 'classic' ? (
        <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-3">
          <span className="text-xs font-mono text-[#8b949e] uppercase block">Классическая схема: Человек пишет жесткие правила</span>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-3 font-mono text-xs text-center">
            <div className="p-3 rounded-lg bg-[#161b22] border border-[#30363d] w-36">
              <span className="text-[#58a6ff] font-bold block">1. Данные</span>
              <span className="text-[#8b949e] text-[10px]">Входные числа</span>
            </div>
            <span className="text-sm text-[#8b949e]">+</span>
            <div className="p-3 rounded-lg bg-[#161b22] border border-[#d29922] w-36">
              <span className="text-[#d29922] font-bold block">2. Правила</span>
              <span className="text-[#8b949e] text-[10px]">Код человека</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#8b949e]" />
            <div className="p-3 rounded-lg bg-[#161b22] border border-[#3fb950] w-36">
              <span className="text-[#3fb950] font-bold block">3. Ответ</span>
              <span className="text-[#8b949e] text-[10px]">Результат</span>
            </div>
          </div>
          <p className="text-xs text-[#8b949e]">
            Человек сам описывает каждый случай: <code>if temp &lt; 0: return 'мороз'</code>. Для сложных задач (распознавание кота) правил нужны миллионы.
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-3">
          <span className="text-xs font-mono text-[#58a6ff] uppercase block">Парадигма ML: Компьютер сам находит правила по примерам</span>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-3 font-mono text-xs text-center">
            <div className="p-3 rounded-lg bg-[#161b22] border border-[#30363d] w-36">
              <span className="text-[#58a6ff] font-bold block">1. Примеры</span>
              <span className="text-[#8b949e] text-[10px]">10 000 фото</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#8b949e]" />
            <div className="p-3 rounded-lg bg-[#161b22] border border-[#58a6ff] w-36">
              <span className="text-[#58a6ff] font-bold block">2. Обучение</span>
              <span className="text-[#8b949e] text-[10px]">Подбор параметров</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#8b949e]" />
            <div className="p-3 rounded-lg bg-[#161b22] border border-[#3fb950] w-36">
              <span className="text-[#3fb950] font-bold block">3. Модель (f)</span>
              <span className="text-[#8b949e] text-[10px]">Готовый прогноз</span>
            </div>
          </div>
          <p className="text-xs text-[#8b949e]">
            В ML компьютер настраивает параметры функции $y = f(x)$ сам на основе данных. Затем новая информация подается на вход обученной модели!
          </p>
        </div>
      )}
    </div>
  );
};
