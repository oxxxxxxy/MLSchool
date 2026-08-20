import React, { useState } from 'react';
import { Scan, Sparkles } from 'lucide-react';
import { MathText } from '../../math/MathText';

interface DigitSample {
  id: number;
  label: number;
  pixels: number[][]; // 5x5 grid
}

const SAMPLES: DigitSample[] = [
  {
    id: 0,
    label: 0,
    pixels: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1]
    ]
  },
  {
    id: 1,
    label: 1,
    pixels: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0]
    ]
  },
  {
    id: 7,
    label: 7,
    pixels: [
      [1, 1, 1, 1, 1],
      [0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0]
    ]
  }
];

export const DigitRecognizerMini: React.FC = () => {
  const [selectedDigit, setSelectedDigit] = useState<number>(0);

  const currentSample = SAMPLES.find(s => s.id === selectedDigit) || SAMPLES[0];

  const probabilities = {
    0: selectedDigit === 0 ? 96 : selectedDigit === 7 ? 2 : 1,
    1: selectedDigit === 1 ? 98 : selectedDigit === 7 ? 4 : 1,
    7: selectedDigit === 7 ? 94 : selectedDigit === 1 ? 2 : 1
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Эксперимент 4 (Многоклассовая классификация)
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Распознавание рукописных цифр</h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#3fb950] bg-[#0d1117] px-2.5 py-1 rounded border border-[#30363d]">
          Класс: Цифра {currentSample.label}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Pixel Grid */}
        <div className="space-y-2 text-center">
          <div className="grid grid-cols-5 gap-1 p-2 bg-[#0d1117] border border-[#30363d] rounded-lg">
            {currentSample.pixels.map((row, rIdx) =>
              row.map((val, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-6 h-6 rounded transition-colors ${
                    val === 1 ? 'bg-[#58a6ff] shadow-sm' : 'bg-[#161b22]'
                  }`}
                />
              ))
            )}
          </div>

          <div className="flex gap-1 justify-center">
            {SAMPLES.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedDigit(s.id)}
                className={`px-3 py-1 rounded text-xs font-mono border transition-colors ${
                  selectedDigit === s.id
                    ? 'bg-[#21262d] text-[#58a6ff] border-[#58a6ff] font-bold'
                    : 'bg-[#0d1117] text-[#8b949e] border-[#30363d] hover:text-[#c9d1d9]'
                }`}
              >
                Цифра {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Probabilities Output */}
        <div className="flex-1 w-full space-y-2">
          <span className="text-xs font-mono text-[#8b949e] block">Вероятности классов модели:</span>

          {[0, 1, 7].map(dig => {
            const prob = (probabilities as any)[dig];
            const isWinner = dig === selectedDigit;

            return (
              <div key={dig} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className={isWinner ? 'text-[#f0f6fc] font-bold' : 'text-[#8b949e]'}>
                    Класс «{dig}»:
                  </span>
                  <span className={isWinner ? 'text-[#3fb950] font-bold' : 'text-[#8b949e]'}>
                    {prob}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0d1117] overflow-hidden border border-[#30363d]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isWinner ? 'bg-[#3fb950]' : 'bg-[#21262d]'
                    }`}
                    style={{ width: `${prob}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
