import React, { useState } from 'react';
import { Play, SkipForward, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';
import { MathText } from '../../math/MathText';

interface StepState {
  lineNum: number;
  codeSnippet: string;
  pointIdx: number;
  x: number;
  y: number;
  yHat: number;
  error: number;
  dk: number;
  db: number;
  k: number;
  b: number;
  mse: number;
}

const DATASET = [
  { x: 1, y: 3 },
  { x: 2, y: 5 },
  { x: 3, y: 7 },
  { x: 4, y: 9 },
  { x: 5, y: 11 }
];

export const PythonInterpreterSimulator: React.FC = () => {
  const [stepIdx, setStepIdx] = useState(0);

  const steps: StepState[] = [
    { lineNum: 1, codeSnippet: 'k = 0.0; b = 0.0', pointIdx: 0, x: 1, y: 3, yHat: 0.0, error: -3.0, dk: -6.0, db: -6.0, k: 0.0, b: 0.0, mse: 55.0 },
    { lineNum: 2, codeSnippet: 'y_hat = predict(x, k, b)', pointIdx: 0, x: 1, y: 3, yHat: 0.0, error: -3.0, dk: -6.0, db: -6.0, k: 0.0, b: 0.0, mse: 55.0 },
    { lineNum: 3, codeSnippet: 'error = y_hat - y', pointIdx: 0, x: 1, y: 3, yHat: 0.0, error: -3.0, dk: -6.0, db: -6.0, k: 0.0, b: 0.0, mse: 55.0 },
    { lineNum: 4, codeSnippet: 'dk += 2 * error * x; db += 2 * error', pointIdx: 0, x: 1, y: 3, yHat: 0.0, error: -3.0, dk: -6.0, db: -6.0, k: 0.0, b: 0.0, mse: 55.0 },
    { lineNum: 5, codeSnippet: 'k -= lr * (dk / n); b -= lr * (db / n)', pointIdx: 4, x: 5, y: 11, yHat: 0.0, error: -11.0, dk: -140.0, db: -35.0, k: 0.28, b: 0.07, mse: 41.2 },
    { lineNum: 6, codeSnippet: 'epoch 100: k=1.85, b=0.88', pointIdx: 4, x: 5, y: 11, yHat: 10.13, error: -0.87, dk: -1.2, db: -0.4, k: 1.85, b: 0.88, mse: 0.35 },
    { lineNum: 7, codeSnippet: 'epoch 1000: k=1.99, b=1.01', pointIdx: 4, x: 5, y: 11, yHat: 10.96, error: -0.04, dk: -0.01, db: -0.01, k: 1.99, b: 1.01, mse: 0.002 }
  ];

  const cur = steps[stepIdx];

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Главный симулятор: Стань интерпретатором Python</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Пошаговое выполнение программы обучения без библиотек</h3>
        </div>
        <button onClick={() => setStepIdx(0)} className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d]">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Left: Code Box with active line */}
        <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] font-mono text-xs space-y-1">
          <span className="text-[10px] text-[#8b949e] uppercase block pb-1 border-b border-[#21262d]">1. Исходный код Python:</span>
          <pre className="text-[#c9d1d9] leading-relaxed overflow-x-auto">
{`def train(data, epochs=1000, lr=0.01):
    k, b = 0.0, 0.0
    for epoch in range(epochs):
        dk, db = 0.0, 0.0
        for x, y in data:
            y_hat = k * x + b
            error = y_hat - y
            dk += 2 * error * x
            db += 2 * error
        k -= lr * (dk / len(data))
        b -= lr * (db / len(data))
    return k, b`}
          </pre>
          <div className="p-2 rounded bg-[#161b22] border border-[#58a6ff] text-[#58a6ff] text-[11px]">
            ▶ Выполняется: <code>{cur.codeSnippet}</code>
          </div>
        </div>

        {/* Right: RAM State / Variable Inspector */}
        <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2 font-mono text-xs">
          <span className="text-[10px] text-[#8b949e] uppercase block pb-1 border-b border-[#21262d]">2. Память программы (Переменные):</span>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded bg-[#161b22] border border-[#30363d]">
              <span className="text-[#8b949e] text-[10px] block">Точка x, y:</span>
              <span className="text-[#58a6ff] font-bold">({cur.x}, {cur.y})</span>
            </div>
            <div className="p-2 rounded bg-[#161b22] border border-[#30363d]">
              <span className="text-[#8b949e] text-[10px] block">Прогноз ŷ:</span>
              <span className="text-[#d29922] font-bold">{cur.yHat.toFixed(2)}</span>
            </div>
            <div className="p-2 rounded bg-[#161b22] border border-[#30363d]">
              <span className="text-[#8b949e] text-[10px] block">Ошибка error:</span>
              <span className="text-[#f85149] font-bold">{cur.error.toFixed(2)}</span>
            </div>
            <div className="p-2 rounded bg-[#161b22] border border-[#30363d]">
              <span className="text-[#8b949e] text-[10px] block">Текущий Loss (MSE):</span>
              <span className="text-[#3fb950] font-bold">{cur.mse.toFixed(3)}</span>
            </div>
            <div className="p-2 rounded bg-[#161b22] border border-[#30363d]">
              <span className="text-[#8b949e] text-[10px] block">Параметр k (наклон):</span>
              <span className="text-[#58a6ff] font-bold">{cur.k.toFixed(2)}</span>
            </div>
            <div className="p-2 rounded bg-[#161b22] border border-[#30363d]">
              <span className="text-[#8b949e] text-[10px] block">Параметр b (сдвиг):</span>
              <span className="text-[#d29922] font-bold">{cur.b.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
          disabled={stepIdx === steps.length - 1}
          className="flex-1 py-2 px-3 rounded bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 text-white font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
        >
          <SkipForward className="w-4 h-4" />
          <span>{stepIdx === steps.length - 1 ? '✅ Модель обучилась: y ≈ 2x + 1' : 'Следующая инструкция Python ➔'}</span>
        </button>
      </div>
    </div>
  );
};
