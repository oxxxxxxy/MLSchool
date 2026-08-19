import React, { useState } from 'react';
import { QuizQuestion } from '@ml-school/shared';
import { FormulaView } from '../math/FormulaView';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizRunnerProps {
  lessonId: number;
  lessonTitle: string;
  questions: QuizQuestion[];
  xpReward: number;
  onComplete: (score: number) => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  lessonId,
  lessonTitle,
  questions,
  xpReward,
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelect = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
  };

  const handleCheck = () => {
    if (!selectedOptionId || isAnswered) return;
    setIsAnswered(true);

    const chosen = currentQ.options.find(o => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      setIsFinished(true);
      const finalScore = Math.round(((correctAnswersCount + (selectedOptionId && currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect ? 1 : 0)) / questions.length) * 100);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      onComplete(finalScore);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setShowHint(false);
    setCorrectAnswersCount(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const totalScore = Math.round((correctAnswersCount / questions.length) * 100);
    const isPassed = totalScore >= 70;

    return (
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
          <Trophy className="w-10 h-10 text-white" />
        </div>

        <div>
          <h3 className="text-2xl font-extrabold text-white">
            {isPassed ? '🎉 Великолепно! Тест сдан!' : 'Почти получилось!'}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Правильных ответов: <span className="text-white font-bold">{correctAnswersCount} из {questions.length}</span> ({totalScore}%)
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-around">
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Награда</div>
            <div className="text-lg font-black text-amber-400 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-4 h-4" />
              +{isPassed ? xpReward : Math.round(xpReward / 2)} XP
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Статус</div>
            <div className={`text-sm font-bold mt-1 ${isPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isPassed ? '✅ Модуль освоен' : '🔄 Рекомендуем повторить'}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Пройти снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Интерактивный квиз
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            Вопрос {currentIndex + 1} из {questions.length}
          </h3>
        </div>

        <div className="flex gap-1.5">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`w-7 h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-indigo-500 ring-2 ring-indigo-500/40'
                  : idx < currentIndex
                  ? 'bg-emerald-500'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
        <p className="text-base font-semibold text-slate-100 leading-relaxed">
          {currentQ.prompt}
        </p>

        {currentQ.mathFormula && (
          <div className="py-2 px-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 inline-block">
            <FormulaView latex={currentQ.mathFormula} displayMode={true} />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {currentQ.options.map(option => {
          const isSelected = selectedOptionId === option.id;
          let style = 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-200';

          if (isAnswered) {
            if (option.isCorrect) {
              style = 'bg-emerald-950/40 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-500/10';
            } else if (isSelected && !option.isCorrect) {
              style = 'bg-rose-950/40 border-rose-500 text-rose-100 shadow-md shadow-rose-500/10';
            }
          } else if (isSelected) {
            style = 'bg-indigo-950/50 border-indigo-500 text-white ring-1 ring-indigo-500';
          }

          return (
            <button
              key={option.id}
              disabled={isAnswered}
              onClick={() => handleSelect(option.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${style}`}
            >
              <span className="text-sm font-medium leading-relaxed">{option.text}</span>
              {isAnswered && (
                <div>
                  {option.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : isSelected ? (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation when answered */}
      {isAnswered && (
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 animate-fadeIn">
          <span className="font-bold">Объяснение: </span>
          {currentQ.options.find(o => o.id === selectedOptionId)?.explanation || currentQ.options.find(o => o.isCorrect)?.explanation}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition-colors font-medium"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{showHint ? 'Скрыть подсказку' : 'Нужна подсказка?'}</span>
        </button>

        {!isAnswered ? (
          <button
            disabled={!selectedOptionId}
            onClick={handleCheck}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
          >
            Проверить ответ
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all"
          >
            <span>{currentIndex + 1 < questions.length ? 'Следующий вопрос' : 'Завершить тест'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {showHint && (
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300">
          💡 <strong>Подсказка:</strong> {currentQ.hint}
        </div>
      )}
    </div>
  );
};
