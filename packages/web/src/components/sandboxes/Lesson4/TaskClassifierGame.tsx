import React, { useState } from 'react';
import { Target, Tag, Layers, CheckCircle2, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import { MathText } from '../../math/MathText';
import confetti from 'canvas-confetti';

interface MLTaskCard {
  id: number;
  title: string;
  category: 'regression' | 'classification' | 'clustering';
  desc: string;
  techTag: 'CV' | 'LLM' | 'Robotics' | 'Recommender';
}

const CARDS: MLTaskCard[] = [
  {
    id: 1,
    title: '🚗 Тесла определяет пешехода на дороге',
    category: 'classification',
    desc: 'Выбор категории: «Человек», «Машина», «Светофор» или «Пустая дорога».',
    techTag: 'CV'
  },
  {
    id: 2,
    title: '🤖 ChatGPT выбирает следующее слово в предложении',
    category: 'classification',
    desc: 'Классификация из словаря 50 000 слов: какое слово наиболее вероятно идет дальше.',
    techTag: 'LLM'
  },
  {
    id: 3,
    title: '💰 Предсказание цены квартиры по площади и району',
    category: 'regression',
    desc: 'Результат — точное непрерывное число (например, 7 850 000 рублей).',
    techTag: 'Robotics'
  },
  {
    id: 4,
    title: '🎵 Spotify группирует похожие треки в умный плейлист',
    category: 'clustering',
    desc: 'Никто заранее не дал жанры: алгоритм сам находит близкие по ритму и спектру песни.',
    techTag: 'Recommender'
  },
  {
    id: 5,
    title: '🌡️ Прогноз точной температуры на завтра (+18.4°C)',
    category: 'regression',
    desc: 'Результат — числовое значение на термометре.',
    techTag: 'Robotics'
  },
  {
    id: 6,
    title: '🌌 Телескоп находит неизвестные типы галактик',
    category: 'clustering',
    desc: 'Группировка миллионов снимков звезд по скрытой похожести без подсказок астрономов.',
    techTag: 'CV'
  }
];

export const TaskClassifierGame: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentCard = CARDS[currentIdx];

  const handleChoose = (type: 'regression' | 'classification' | 'clustering') => {
    if (feedback) return;
    const isCorrect = type === currentCard.category;
    if (isCorrect) {
      setUserScore(prev => prev + 1);
      setFeedback({
        isCorrect: true,
        text: `Верно! ${currentCard.desc}`
      });
    } else {
      const correctName = currentCard.category === 'regression' ? 'Регрессия' : currentCard.category === 'classification' ? 'Классификация' : 'Кластеризация';
      setFeedback({
        isCorrect: false,
        text: `Не совсем. Правильный ответ — ${correctName}. ${currentCard.desc}`
      });
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < CARDS.length) {
      setCurrentIdx(prev => prev + 1);
      setFeedback(null);
    } else {
      setIsFinished(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setUserScore(0);
    setFeedback(null);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-center space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 mx-auto rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#3fb950]">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#f0f6fc]">
            Отличная работа с типами задач ML!
          </h3>
          <p className="text-xs font-mono text-[#8b949e] mt-1">
            Правильно определено: {userScore} из {CARDS.length}
          </p>
        </div>
        <button
          onClick={handleRestart}
          className="px-4 py-2 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-mono text-xs border border-[#30363d] transition-colors"
        >
          Сыграть снова
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Тренажер-Сортировщик
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">К какому типу относится эта задача?</h3>
        </div>
        <span className="text-xs font-mono text-[#d29922]">
          Карточка {currentIdx + 1} из {CARDS.length} (Счет: {userScore})
        </span>
      </div>

      {/* The Active Card */}
      <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#58a6ff] bg-[#58a6ff]/10 px-2 py-0.5 rounded border border-[#58a6ff]/20">
            Сфера: {currentCard.techTag}
          </span>
        </div>
        <h4 className="text-sm sm:text-base font-bold text-[#f0f6fc] pt-1">
          {currentCard.title}
        </h4>
      </div>

      {/* 3 Action Target Buckets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
        <button
          disabled={!!feedback}
          onClick={() => handleChoose('regression')}
          className="p-3 rounded-lg bg-[#0d1117] hover:bg-[#21262d] disabled:opacity-50 border border-[#30363d] hover:border-[#58a6ff] transition-all text-left group"
        >
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#58a6ff] mb-1">
            <Target className="w-3.5 h-3.5" />
            <span className="font-bold">1. Регрессия</span>
          </div>
          <p className="text-[11px] text-[#8b949e] leading-snug">
            Угадать точное число или прогноз (цена, вес, градусы)
          </p>
        </button>

        <button
          disabled={!!feedback}
          onClick={() => handleChoose('classification')}
          className="p-3 rounded-lg bg-[#0d1117] hover:bg-[#21262d] disabled:opacity-50 border border-[#30363d] hover:border-[#3fb950] transition-all text-left group"
        >
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#3fb950] mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span className="font-bold">2. Классификация</span>
          </div>
          <p className="text-[11px] text-[#8b949e] leading-snug">
            Выбрать категорию или класс (спам/нет, кот/пес, слово)
          </p>
        </button>

        <button
          disabled={!!feedback}
          onClick={() => handleChoose('clustering')}
          className="p-3 rounded-lg bg-[#0d1117] hover:bg-[#21262d] disabled:opacity-50 border border-[#30363d] hover:border-[#bc8cff] transition-all text-left group"
        >
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#bc8cff] mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span className="font-bold">3. Кластеризация</span>
          </div>
          <p className="text-[11px] text-[#8b949e] leading-snug">
            Сгруппировать похожее без учителя (плейлисты, группы)
          </p>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${
          feedback.isCorrect ? 'bg-[#238636]/15 border-[#2ea043] text-[#3fb950]' : 'bg-[#da3633]/15 border-[#f85149] text-[#f85149]'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.isCorrect ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
            <span className="text-[#c9d1d9] leading-relaxed">{feedback.text}</span>
          </div>

          <button
            onClick={handleNext}
            className="px-3 py-1 rounded bg-[#1f6feb] hover:bg-[#388bfd] text-white font-mono text-xs flex-shrink-0 transition-colors"
          >
            Далее →
          </button>
        </div>
      )}
    </div>
  );
};
