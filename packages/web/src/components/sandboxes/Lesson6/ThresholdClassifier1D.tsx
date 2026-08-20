import React, { useState } from 'react';
import { Tag, CheckCircle2, XCircle } from 'lucide-react';
import { MathText } from '../../math/MathText';

interface StudentExam {
  id: number;
  name: string;
  score: number;
}

const STUDENTS: StudentExam[] = [
  { id: 1, name: 'Алексей', score: 42 },
  { id: 2, name: 'Мария', score: 85 },
  { id: 3, name: 'Иван', score: 58 },
  { id: 4, name: 'Елена', score: 73 },
  { id: 5, name: 'Дмитрий', score: 61 },
  { id: 6, name: 'Анна', score: 92 },
  { id: 7, name: 'Артем', score: 35 }
];

export const ThresholdClassifier1D: React.FC = () => {
  const [passThreshold, setPassThreshold] = useState<number>(60);

  const passedCount = STUDENTS.filter(s => s.score >= passThreshold).length;
  const failedCount = STUDENTS.length - passedCount;

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Эксперимент 1 (1 Признак: Порог решения)
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Бинарная классификация: Сдал / Не сдал экзамен</h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#58a6ff] bg-[#0d1117] px-2.5 py-1 rounded border border-[#30363d]">
          Порог: {passThreshold} баллов
        </span>
      </div>

      <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-[#8b949e]">Проходной балл (Порог x₀):</span>
          <span className="text-[#58a6ff] font-bold">{passThreshold} баллов</span>
        </div>
        <input
          type="range"
          min="30"
          max="90"
          step="5"
          value={passThreshold}
          onChange={e => setPassThreshold(Number(e.target.value))}
          className="w-full accent-[#58a6ff] cursor-pointer"
        />
      </div>

      {/* 1D Number line visualization */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {STUDENTS.map(st => {
            const isPassed = st.score >= passThreshold;

            return (
              <div
                key={st.id}
                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                  isPassed
                    ? 'bg-[#238636]/10 border-[#2ea043]/40 text-[#3fb950]'
                    : 'bg-[#da3633]/10 border-[#f85149]/40 text-[#f85149]'
                }`}
              >
                <div>
                  <span className="font-semibold text-[#f0f6fc] block">{st.name}</span>
                  <span className="text-[10px] font-mono text-[#8b949e]">{st.score} баллов</span>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isPassed ? 'bg-[#238636]/20 text-[#3fb950]' : 'bg-[#da3633]/20 text-[#f85149]'
                }`}>
                  {isPassed ? '✅ СДАЛ' : '❌ НЕ СДАЛ'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-around p-2.5 rounded bg-[#0d1117] border border-[#30363d] text-xs font-mono">
        <div>Сдали: <span className="text-[#3fb950] font-bold">{passedCount}</span></div>
        <div className="h-4 w-px bg-[#30363d]" />
        <div>Не сдали: <span className="text-[#f85149] font-bold">{failedCount}</span></div>
      </div>
    </div>
  );
};
