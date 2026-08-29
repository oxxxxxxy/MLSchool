import React, { useState } from 'react';
import { Split, Sparkles } from 'lucide-react';
import { MathText } from '../../math/MathText';

interface DataItem {
  id: number;
  x: number;
  y: number;
  type: 'train' | 'test';
}

const ALL_10_POINTS: DataItem[] = [
  { id: 1, x: 1, y: 3.1, type: 'train' },
  { id: 2, x: 2, y: 4.9, type: 'train' },
  { id: 3, x: 3, y: 7.2, type: 'train' },
  { id: 4, x: 4, y: 8.8, type: 'train' },
  { id: 5, x: 5, y: 11.1, type: 'train' },
  { id: 6, x: 6, y: 13.0, type: 'train' },
  { id: 7, x: 7, y: 15.2, type: 'train' },
  { id: 8, x: 8, y: 16.9, type: 'test' },
  { id: 9, x: 9, y: 19.1, type: 'test' },
  { id: 10, x: 10, y: 21.0, type: 'test' }
];

export const TrainTestSplitter: React.FC = () => {
  const [isSplit, setIsSplit] = useState<boolean>(true);

  const trainPts = ALL_10_POINTS.filter(p => p.type === 'train');
  const testPts = ALL_10_POINTS.filter(p => p.type === 'test');

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Генерализация модели</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Разделение данных: Обучающая (Train) и Тестовая (Test) выборки</h3>
        </div>
        <button
          onClick={() => setIsSplit(!isSplit)}
          className={`px-3 py-1 rounded text-xs font-mono transition-colors border ${
            isSplit ? 'bg-[#238636] text-white border-[#2ea043]' : 'bg-[#21262d] text-[#c9d1d9] border-[#30363d]'
          }`}
        >
          {isSplit ? '70% Train / 30% Test' : 'Все точки вместе'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Train Card */}
        <div className="p-3 rounded-lg bg-[#0d1117] border border-[#58a6ff]/40 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#58a6ff] font-bold">1. ОБУЧАЮЩИЙ НАБОР (TRAIN) — 70%</span>
            <span className="text-[#8b949e]">{trainPts.length} точек</span>
          </div>
          <p className="text-[11px] text-[#8b949e]">
            Используются для вычисления градиентов и обновления $k$ и $b$.
          </p>
          <div className="text-xs font-mono text-[#3fb950] font-bold">
            Train MSE: 0.03 (Модель отлично выучила эти примеры)
          </div>
        </div>

        {/* Test Card */}
        <div className="p-3 rounded-lg bg-[#0d1117] border border-[#d29922]/40 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#d29922] font-bold">2. ТЕСТОВЫЙ НАБОР (TEST) — 30%</span>
            <span className="text-[#8b949e]">{testPts.length} точки</span>
          </div>
          <p className="text-[11px] text-[#8b949e]">
            Скрыты во время обучения. Модель видит их впервые только при проверке.
          </p>
          <div className="text-xs font-mono text-[#58a6ff] font-bold">
            Test MSE: 0.05 (Модель честно работает на новых данных!)
          </div>
        </div>
      </div>
    </div>
  );
};
