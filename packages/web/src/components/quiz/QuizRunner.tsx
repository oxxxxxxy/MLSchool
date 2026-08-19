import React, { useState } from 'react';
import { QuizQuestion } from '@ml-school/shared';
import { MathText } from '../math/MathText';
import { FormulaView } from '../math/FormulaView';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Zap } from 'lucide-react';
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
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
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
      <div className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] text-center space-y-4 max-w-xl mx-auto">
        <div className="w-12 h-12 mx-auto rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#d29922]">
          <Trophy className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-base font-semibold text-[#f0f6fc]">
            {isPassed ? 'Тест успешно пройден' : 'Попробуй еще раз'}
          </h3>
          <p className="text-xs text-[#8b949e] mt-1 font-mono">
            Правильно: {correctAnswersCount} из {questions.length} ({totalScore}%)
          </p>
        </div>

        <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] flex items-center justify-around text-xs font-mono">
          <div>
            <span className="text-[#8b949e] block text-[10px]">Награда</span>
            <span className="text-[#d29922] font-semibold">+{isPassed ? xpReward : Math.round(xpReward / 2)} XP</span>
          </div>
          <div className="h-6 w-px bg-[#30363d]" />
          <div>
            <span className="text-[#8b949e] block text-[10px]">Статус</span>
            <span className={isPassed ? 'text-[#3fb950] font-semibold' : 'text-[#d29922] font-semibold'}>
              {isPassed ? 'Пройдено' : 'Повторить'}
            </span>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="px-4 py-2 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] font-medium text-xs border border-[#30363d] transition-colors"
        >
          Пройти снова
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
        <span className="text-xs font-mono text-[#8b949e]">
          Вопрос {currentIndex + 1} из {questions.length}
        </span>

        <div className="flex gap-1">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`w-6 h-1.5 rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-[#58a6ff]'
                  : idx < currentIndex
                  ? 'bg-[#238636]'
                  : 'bg-[#21262d]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Prompt with MathText */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-[#f0f6fc] leading-relaxed">
          <MathText text={currentQ.prompt} />
        </div>

        {currentQ.mathFormula && (
          <div className="py-2 px-3 rounded bg-[#0d1117] border border-[#30363d] text-center text-xs font-mono text-[#58a6ff]">
            <FormulaView latex={currentQ.mathFormula} displayMode={true} />
          </div>
        )}
      </div>

      {/* Options with MathText */}
      <div className="space-y-2">
        {currentQ.options.map(option => {
          const isSelected = selectedOptionId === option.id;
          let style = 'bg-[#0d1117] border-[#30363d] hover:border-[#8b949e] text-[#c9d1d9]';

          if (isAnswered) {
            if (option.isCorrect) {
              style = 'bg-[#238636]/15 border-[#2ea043] text-[#3fb950]';
            } else if (isSelected && !option.isCorrect) {
              style = 'bg-[#da3633]/15 border-[#f85149] text-[#f85149]';
            }
          } else if (isSelected) {
            style = 'bg-[#1f6feb]/15 border-[#58a6ff] text-[#f0f6fc]';
          }

          return (
            <button
              key={option.id}
              disabled={isAnswered}
              onClick={() => handleSelect(option.id)}
              className={`w-full p-3 rounded-md border text-left text-xs sm:text-sm font-medium transition-colors flex items-center justify-between gap-2 ${style}`}
            >
              <div>
                <MathText text={option.text} />
              </div>
              {isAnswered && (
                <div>
                  {option.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-[#3fb950] flex-shrink-0" />
                  ) : isSelected ? (
                    <XCircle className="w-4 h-4 text-[#f85149] flex-shrink-0" />
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation when answered */}
      {isAnswered && (
        <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] text-xs text-[#8b949e] leading-relaxed">
          <span className="font-semibold text-[#f0f6fc]">Объяснение: </span>
          <MathText text={currentQ.options.find(o => o.id === selectedOptionId)?.explanation || currentQ.options.find(o => o.isCorrect)?.explanation || ''} />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-xs text-[#8b949e] hover:text-[#58a6ff] transition-colors font-mono"
        >
          {showHint ? 'Скрыть подсказку' : 'Подсказка'}
        </button>

        {!isAnswered ? (
          <button
            disabled={!selectedOptionId}
            onClick={handleCheck}
            className="px-4 py-1.5 rounded-md bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs transition-colors"
          >
            Проверить
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#1f6feb] hover:bg-[#388bfd] text-white font-medium text-xs transition-colors"
          >
            <span>{currentIndex + 1 < questions.length ? 'Далее' : 'Завершить'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {showHint && (
        <div className="p-2.5 rounded bg-[#0d1117] border border-[#d29922]/40 text-xs text-[#d29922]">
          <MathText text={currentQ.hint} />
        </div>
      )}
    </div>
  );
};
