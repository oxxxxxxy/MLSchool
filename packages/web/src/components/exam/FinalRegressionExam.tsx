import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, ArrowRight, Play, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  { id: 1, q: 'Что такое x в машинном обучении?', options: ['Входной признак (информация, которую получает модель)', 'Номер версии Python', 'Случайное число'], correct: 0, explanation: 'x — это входной признак (feature), например площадь или температура.' },
  { id: 2, q: 'Что такое y в обучающем датасете?', options: ['Правильный ответ (Target), данный учителем', 'Предсказание модели', 'Наклон прямой'], correct: 0, explanation: 'y — это истинный правильный ответ (Ground Truth Target).' },
  { id: 3, q: 'Что означает символ ŷ («игрек с крышкой»)?', options: ['Prediction — прогноз, который выдала модель', 'Ошибку модели', 'Скорость обучения'], correct: 0, explanation: 'ŷ — это предсказание модели ŷ = kx + b.' },
  { id: 4, q: 'Какие параметры есть у простой линейной регрессии?', options: ['k (наклон) и b (свободный сдвиг)', 'Только x и y', 'Learning rate и Epoch'], correct: 0, explanation: 'Модель линейной регрессии настраивает два параметра: k и b.' },
  { id: 5, q: 'Что делает коэффициент k?', options: ['Управляет наклоном (крутизной) прямой', 'Сдвигает прямую вверх-вниз', 'Считает количество эпох'], correct: 0, explanation: 'k — угловой коэффициент (наклон).' },
  { id: 6, q: 'Что делает коэффициент b?', options: ['Сдвигает прямую вверх или вниз по вертикальной оси', 'Вращает прямую', 'Считает процент ошибок'], correct: 0, explanation: 'b показывает точку пересечения с осью Y при x = 0.' },
  { id: 7, q: 'Что такое residual (ошибка одной точки)?', options: ['Разница между прогнозом и фактом: e = ŷ - y', 'Сумма всех чисел', 'Номер строки в файле'], correct: 0, explanation: 'e = ŷ - y — отклонение прогноза от реальности.' },
  { id: 8, q: 'Почему нельзя просто сложить ошибки со знаками (Σe)?', options: ['Потому что положительные и отрицательные ошибки взаимно уничтожаются в ноль', 'Потому что сумма не умеет работать с дробями', 'Это запрещено языком Python'], correct: 0, explanation: '+5 и -5 дают сумму 0, маскируя реальные промахи.' },
  { id: 9, q: 'Что измеряет Mean Squared Error (MSE)?', options: ['Среднюю квадратичную ошибку по всем точкам датасета', 'Скорость работы процессора', 'Количество строк кода'], correct: 0, explanation: 'MSE = (1/n) Σ(ŷ - y)² — главная мера ошибки (Loss).' },
  { id: 10, q: 'Почему Loss зависит от k и b?', options: ['Потому что прогноз ŷ зависит от k и b, а значит и ошибка зависит от них', 'Loss не зависит от параметров', 'Потому что так захотел программист'], correct: 0, explanation: 'Меняя k и b, мы меняем линию и величину ошибки L(k,b).' },
  { id: 11, q: 'Что означает частная производная ∂L/∂k?', options: ['Как изменяется ошибка Loss при маленьком изменении k (при замороженном b)', 'Цвет линии на графике', 'Сумму признаков x'], correct: 0, explanation: '∂L/∂k показывает чувствительность Loss к наклону k.' },
  { id: 12, q: 'Что означает частная производная ∂L/∂b?', options: ['Как изменяется ошибка Loss при маленьком изменении сдвига b', 'Количество эпох', 'Размер шага'], correct: 0, explanation: '∂L/∂b показывает чувствительность Loss к сдвигу b.' },
  { id: 13, q: 'Куда указывает вектор градиента ∇L?', options: ['В сторону самого быстрого РОСТА ошибки Loss (вверх)', 'В сторону дна чаши (вниз)', 'Строго на восток'], correct: 0, explanation: 'Градиент всегда показывает направление быстрейшего подъема.' },
  { id: 14, q: 'Почему Gradient Descent ВЫЧИТАЕТ градиент (k = k - α·dk)?', options: ['Чтобы двигаться в сторону СПУСКА к минимуму ошибки (-∇L)', 'Потому что так проще считать', 'Чтобы увеличить ошибку'], correct: 0, explanation: 'Мы хотим уменьшить ошибку, поэтому идем против градиента (-∇L).' },
  { id: 15, q: 'Что делает Learning Rate (α)?', options: ['Определяет размер шага обновления параметров на каждой эпохе', 'Считает количество точек', 'Очищает память'], correct: 0, explanation: 'α регулирует, насколько аккуратно модель шагает к минимуму.' },
  { id: 16, q: 'Что такое Epoch (эпоха обучения)?', options: ['Один полный проход модели по всем обучающим примерам с обновлением параметров', 'Один год работы модели', 'Перезапуск компьютера'], correct: 0, explanation: 'Эпоха — это полный цикл обучения по всему датасету.' },
  { id: 17, q: 'Чем обучение (Training) отличается от применения (Prediction)?', options: ['При обучении параметры k и b МЕНЯЮТСЯ, а при prediction — заморожены', 'Обучение происходит на калькуляторе', 'Ничем не отличаются'], correct: 0, explanation: 'Обучение находит параметры, а prediction просто использует формулу.' },
  { id: 18, q: 'Чем обучающая выборка (Train) отличается от тестовой (Test)?', options: ['Train используется для настройки параметров, а Test — для честной независимой проверки', 'В Test содержатся только картинки', 'Train всегда в 100 раз больше'], correct: 0, explanation: 'Test данные модель не видит во время обучения.' }
];

export const FinalRegressionExam: React.FC = () => {
  const [examPart, setExamPart] = useState<number>(1);

  // Part 1 Pipeline
  const pipelineCards = ['Dataset (Данные)', 'Prediction (ŷ = kx + b)', 'Error (e = ŷ - y)', 'Loss (MSE)', 'Gradient (dk, db)', 'Update (k, b)', 'Next Epoch'];
  const [pipelineSequence, setPipelineSequence] = useState<string[]>([]);
  const isPart1Ok = pipelineSequence.length === 7 && pipelineSequence.every((val, idx) => val === pipelineCards[idx]);

  // Part 2 Questions
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [qFeedback, setQFeedback] = useState<{ isOk: boolean; text: string } | null>(null);

  // Part 5 Running Model
  const [isModelRunning, setIsModelRunning] = useState(false);
  const [learnedK, setLearnedK] = useState(0.0);
  const [learnedB, setLearnedB] = useState(0.0);
  const [learnedMSE, setLearnedMSE] = useState(55.0);

  const handleSelectQ = (optIdx: number) => {
    if (qFeedback) return;
    const isOk = optIdx === QUESTIONS[currentQ].correct;
    setUserAnswers(prev => ({ ...prev, [currentQ]: optIdx }));
    setQFeedback({ isOk, text: QUESTIONS[currentQ].explanation });
    if (isOk) confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
  };

  const handleNextQ = () => {
    setQFeedback(null);
    if (currentQ + 1 < QUESTIONS.length) {
      setCurrentQ(prev => prev + 1);
    } else {
      setExamPart(3);
    }
  };

  const handleRunFinalModel = () => {
    setIsModelRunning(true);
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setLearnedK(prev => prev + 0.04);
      setLearnedB(prev => prev + 0.02);
      setLearnedMSE(prev => Math.max(0.005, prev * 0.85));
      if (step >= 50) {
        clearInterval(timer);
        setLearnedK(2.01);
        setLearnedB(0.98);
        setLearnedMSE(0.003);
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      }
    }, 60);
  };

  return (
    <div className="p-5 sm:p-7 rounded-2xl bg-[#161b22] border-2 border-[#30363d] space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#30363d] pb-4">
        <div>
          <span className="text-xs font-mono text-[#d29922] uppercase tracking-wider flex items-center gap-1.5 font-bold">
            <Award className="w-4 h-4" /> Итоговая аттестация курса
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#f0f6fc]">
            Финальный Экзамен по Линейной Регрессии (Часть {examPart} из 5)
          </h2>
        </div>
        <div className="flex gap-1.5 font-mono text-xs">
          {[1, 2, 3, 4, 5].map(p => (
            <div
              key={p}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                examPart === p ? 'bg-[#58a6ff] text-white' : examPart > p ? 'bg-[#238636] text-white' : 'bg-[#0d1117] text-[#8b949e] border border-[#30363d]'
              }`}
            >
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* PART 1: Pipeline Assembly */}
      {examPart === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#f0f6fc]">Часть 1: Собери правильный конвейер (Pipeline) обучения</h3>
            <p className="text-xs text-[#8b949e]">Кликай по блокам в том порядке, в котором алгоритм выполняет вычисления.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0d1117] border-2 border-dashed border-[#30363d] min-h-[70px] flex flex-wrap items-center justify-center gap-2">
            {pipelineSequence.length === 0 ? (
              <span className="text-xs font-mono text-[#8b949e]">Кликни по первой карточке снизу</span>
            ) : (
              pipelineSequence.map((c, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <div className="px-3 py-1.5 rounded bg-[#21262d] border border-[#58a6ff] font-mono text-xs font-bold text-[#f0f6fc]">
                    {idx + 1}. {c}
                  </div>
                  {idx < pipelineSequence.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-[#8b949e]" />}
                </div>
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {pipelineCards.map(c => {
              const isUsed = pipelineSequence.includes(c);
              return (
                <button
                  key={c}
                  disabled={isUsed || isPart1Ok}
                  onClick={() => setPipelineSequence([...pipelineSequence, c])}
                  className={`px-3.5 py-2 rounded-lg border font-mono text-xs font-bold transition-all ${
                    isUsed ? 'bg-[#161b22] border-[#21262d] text-[#484f58] opacity-40' : 'bg-[#0d1117] hover:bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:border-[#58a6ff]'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {isPart1Ok && (
            <div className="p-3 rounded-lg bg-[#238636]/15 border border-[#2ea043] flex items-center justify-between text-xs font-mono text-[#3fb950]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Пайплайн собран идеально!</span>
              </div>
              <button onClick={() => setExamPart(2)} className="px-3 py-1 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-bold">
                Перейти к Части 2 ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* PART 2: 18 Concepts */}
      {examPart === 2 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#8b949e]">Вопрос {currentQ + 1} из {QUESTIONS.length}</span>
            <span className="text-[#58a6ff]">Часть 2: Проверка концепций</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
            <h3 className="text-sm sm:text-base font-bold text-[#f0f6fc]">{QUESTIONS[currentQ].q}</h3>
          </div>

          <div className="space-y-2">
            {QUESTIONS[currentQ].options.map((opt, optIdx) => {
              const isChosen = userAnswers[currentQ] === optIdx;
              const isCorrect = optIdx === QUESTIONS[currentQ].correct;

              return (
                <button
                  key={optIdx}
                  disabled={!!qFeedback}
                  onClick={() => handleSelectQ(optIdx)}
                  className={`w-full p-3 rounded-lg border text-left text-xs font-mono transition-all ${
                    qFeedback
                      ? isCorrect
                        ? 'bg-[#238636]/20 border-[#2ea043] text-[#3fb950] font-bold'
                        : isChosen
                          ? 'bg-[#da3633]/20 border-[#f85149] text-[#f85149]'
                          : 'bg-[#0d1117] border-[#30363d] opacity-50'
                      : 'bg-[#0d1117] hover:bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:border-[#58a6ff]'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {qFeedback && (
            <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
              qFeedback.isOk ? 'bg-[#238636]/15 border-[#2ea043] text-[#3fb950]' : 'bg-[#da3633]/15 border-[#f85149] text-[#f85149]'
            }`}>
              <div className="flex items-center gap-2">
                {qFeedback.isOk ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
                <span className="text-[#c9d1d9]">{qFeedback.text}</span>
              </div>
              <button onClick={handleNextQ} className="px-3 py-1 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-mono text-xs flex-shrink-0">
                {currentQ + 1 < QUESTIONS.length ? 'Далее ➔' : 'К Части 3 ➔'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* PART 3: Mathematical Formulas */}
      {examPart === 3 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#f0f6fc]">Часть 3: Восстанови математические формулы</h3>
            <p className="text-xs text-[#8b949e]">Все 7 ключевых формул линейной регрессии:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
            <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
              <span className="text-[#8b949e] text-[10px] block">1. Prediction:</span>
              <span className="text-[#58a6ff] font-bold">ŷ = k·x + b</span>
            </div>
            <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
              <span className="text-[#8b949e] text-[10px] block">2. Residual (Ошибка):</span>
              <span className="text-[#58a6ff] font-bold">e = ŷ - y</span>
            </div>
            <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
              <span className="text-[#8b949e] text-[10px] block">3. Loss (MSE):</span>
              <span className="text-[#3fb950] font-bold">MSE = (1/n) Σ(ŷ - y)²</span>
            </div>
            <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
              <span className="text-[#8b949e] text-[10px] block">4. Градиент по b:</span>
              <span className="text-[#d29922] font-bold">db = (2/n) Σe</span>
            </div>
            <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
              <span className="text-[#8b949e] text-[10px] block">5. Градиент по k:</span>
              <span className="text-[#d29922] font-bold">dk = (2/n) Σ(e · x)</span>
            </div>
            <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
              <span className="text-[#8b949e] text-[10px] block">6. Обновление параметров:</span>
              <span className="text-[#bc8cff] font-bold">k = k - α·dk ; b = b - α·db</span>
            </div>
          </div>

          <button
            onClick={() => setExamPart(4)}
            className="w-full py-2.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-mono text-xs font-bold transition-colors"
          >
            Математика подтверждена! Перейти к Части 4 ➔
          </button>
        </div>
      )}

      {/* PART 4: Python Code */}
      {examPart === 4 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#f0f6fc]">Часть 4: Код обучения линейной регрессии на чистом Python</h3>
            <p className="text-xs text-[#8b949e]">Полный автономный алгоритм без сторонних библиотек:</p>
          </div>

          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] font-mono text-xs text-[#c9d1d9] leading-relaxed overflow-x-auto">
            <pre>
{`data = [(1, 3), (2, 5), (3, 7), (4, 9), (5, 11)]

def predict(x, k, b):
    return k * x + b

def gradients(data, k, b):
    dk, db, n = 0.0, 0.0, len(data)
    for x, y in data:
        error = predict(x, k, b) - y
        dk += 2 * error * x
        db += 2 * error
    return dk / n, db / n

# Training Loop
k, b, lr = 0.0, 0.0, 0.01
for epoch in range(1000):
    dk, db = gradients(data, k, b)
    k -= lr * dk
    b -= lr * db

print(f"Обучено: y = {k:.2f}x + {b:.2f}")`}
            </pre>
          </div>

          <button
            onClick={() => setExamPart(5)}
            className="w-full py-2.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-mono text-xs font-bold transition-colors"
          >
            Запустить модель на выполнение (Часть 5) ➔
          </button>
        </div>
      )}

      {/* PART 5: Live Execution & Grand Certification */}
      {examPart === 5 && (
        <div className="space-y-4 text-center">
          <div className="p-6 rounded-2xl bg-[#0d1117] border-2 border-[#d29922] space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#d29922]/20 border-2 border-[#d29922] flex items-center justify-center text-[#d29922]">
              <Sparkles className="w-7 h-7" />
            </div>

            <div>
              <span className="text-xs font-mono text-[#d29922] uppercase tracking-widest block font-bold">Сертификат Мастера ML</span>
              <h3 className="text-lg font-bold text-[#f0f6fc] mt-1">«Линейная регрессия с нуля»</h3>
              <p className="text-xs text-[#8b949e] mt-2 leading-relaxed">
                Ты не просто вызвал готовую библиотеку. Ты понимаешь, как модель делает prediction, считает ошибку, вычисляет gradient и обучает собственные параметры!
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#161b22] border border-[#30363d] grid grid-cols-3 gap-2 font-mono text-xs">
              <div>
                <span className="text-[9px] text-[#8b949e] block">Итоговый k</span>
                <span className="text-[#58a6ff] font-bold">{learnedK.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#8b949e] block">Итоговый b</span>
                <span className="text-[#d29922] font-bold">{learnedB.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#8b949e] block">Финальный MSE</span>
                <span className="text-[#3fb950] font-bold">{learnedMSE.toFixed(3)}</span>
              </div>
            </div>

            <button
              disabled={isModelRunning && learnedMSE <= 0.005}
              onClick={handleRunFinalModel}
              className="w-full py-2.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{learnedMSE <= 0.005 ? '🏆 Сертификат получен!' : 'Запустить обучение модели'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
