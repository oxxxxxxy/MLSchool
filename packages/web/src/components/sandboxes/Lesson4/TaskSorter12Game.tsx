import React, { useState } from 'react';
import { Target, Tag, Layers, CheckCircle2, XCircle, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MLCard {
  id: number;
  title: string;
  category: 'regression' | 'classification' | 'clustering';
  desc: string;
}

const ALL_12_TASKS: MLCard[] = [
  { id: 1, title: '🚗 Тесла определяет пешехода на дороге', category: 'classification', desc: 'Выбор категории («Пешеход», «Машина», «Светофор»).' },
  { id: 2, title: '💰 Оценка рыночной стоимости квартиры в рублях', category: 'regression', desc: 'Ответ — точное числовое значение (например, 8.5 млн ₽).' },
  { id: 3, title: '🎵 Spotify группирует похожие песни в автоплейлист', category: 'clustering', desc: 'Правильных ответов нет: поиск скрытых групп по схожести ритма.' },
  { id: 4, title: '🤖 ChatGPT выбирает следующее слово из 50 000 слов', category: 'classification', desc: 'Классификация: выбор слова из фиксированного словаря категорий.' },
  { id: 5, title: '🌡️ Прогноз точной температуры на завтра (+18.4°C)', category: 'regression', desc: 'Ответ — непрерывное число на шкале термометра.' },
  { id: 6, title: '🌌 Телескоп находит неизвестные типы скоплений звезд', category: 'clustering', desc: 'Обучение без учителя: объединение близких звезд в созвездия.' },
  { id: 7, title: '📧 Спам-фильтр почты: Спам или Важное', category: 'classification', desc: 'Бинарная классификация на 2 взаимоисключающих класса.' },
  { id: 8, title: '⚡ Прогноз расхода электричества за месяц (кВт·ч)', category: 'regression', desc: 'Числовой прогноз непрерывной величины.' },
  { id: 9, title: '💳 Банк находит необычные группы мошеннических операций', category: 'clustering', desc: 'Поиск аномальных кластеров транзакций без готовых меток.' },
  { id: 10, title: '⏱️ Расчет точного времени доставки пиццы курьером', category: 'regression', desc: 'Результат — число минут.' },
  { id: 11, title: '🐱 Распознавание: кошка, собака или попугай', category: 'classification', desc: 'Выбор класса животного.' },
  { id: 12, title: '🛒 Разделение покупателей магазина на сегменты по интересам', category: 'clustering', desc: 'Группировка пользователей без учителя.' }
];

export const TaskSorter12Game: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const cur = ALL_12_TASKS[currentIdx];

  const handleChoose = (cat: 'regression' | 'classification' | 'clustering') => {
    if (feedback) return;
    const isCorrect = cat === cur.category;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback({ isCorrect: true, text: `Верно! ${cur.desc}` });
    } else {
      const name = cur.category === 'regression' ? 'Регрессия' : cur.category === 'classification' ? 'Классификация' : 'Кластеризация';
      setFeedback({ isCorrect: false, text: `Не совсем. Правильный тип — ${name}. ${cur.desc}` });
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < ALL_12_TASKS.length) {
      setCurrentIdx(prev => prev + 1);
      setFeedback(null);
    } else {
      setIsFinished(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setFeedback(null);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-center space-y-4 max-w-md mx-auto">
        <Sparkles className="w-8 h-8 text-[#3fb950] mx-auto" />
        <h3 className="text-base font-bold text-[#f0f6fc]">Тест пройден!</h3>
        <p className="text-xs font-mono text-[#8b949e]">Правильно: {score} из {ALL_12_TASKS.length}</p>
        <button onClick={handleRestart} className="px-4 py-2 rounded bg-[#21262d] hover:bg-[#30363d] text-xs font-mono text-[#c9d1d9] border border-[#30363d]">
          Сыграть снова
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#d29922] uppercase">Тренажер: 12 Задач ML</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Определи тип задачи</h3>
        </div>
        <span className="text-xs font-mono text-[#58a6ff]">Задача {currentIdx + 1} из {ALL_12_TASKS.length}</span>
      </div>

      <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1">
        <span className="text-[10px] font-mono text-[#8b949e] uppercase">Ситуация:</span>
        <h4 className="text-sm sm:text-base font-bold text-[#f0f6fc]">{cur.title}</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          disabled={!!feedback}
          onClick={() => handleChoose('regression')}
          className="p-3 rounded-lg bg-[#0d1117] hover:bg-[#21262d] disabled:opacity-50 border border-[#30363d] hover:border-[#58a6ff] text-left transition-all group"
        >
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#58a6ff] mb-1 font-bold">
            <Target className="w-3.5 h-3.5" /> 1. Регрессия
          </div>
          <span className="text-[11px] text-[#8b949e]">Предсказать число (сколько?)</span>
        </button>

        <button
          disabled={!!feedback}
          onClick={() => handleChoose('classification')}
          className="p-3 rounded-lg bg-[#0d1117] hover:bg-[#21262d] disabled:opacity-50 border border-[#30363d] hover:border-[#3fb950] text-left transition-all group"
        >
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#3fb950] mb-1 font-bold">
            <Tag className="w-3.5 h-3.5" /> 2. Классификация
          </div>
          <span className="text-[11px] text-[#8b949e]">Выбрать категорию (какой класс?)</span>
        </button>

        <button
          disabled={!!feedback}
          onClick={() => handleChoose('clustering')}
          className="p-3 rounded-lg bg-[#0d1117] hover:bg-[#21262d] disabled:opacity-50 border border-[#30363d] hover:border-[#bc8cff] text-left transition-all group"
        >
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#bc8cff] mb-1 font-bold">
            <Layers className="w-3.5 h-3.5" /> 3. Кластеризация
          </div>
          <span className="text-[11px] text-[#8b949e]">Группы без учителя (что похоже?)</span>
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
