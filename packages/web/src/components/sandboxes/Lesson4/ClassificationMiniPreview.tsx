import React, { useState } from 'react';
import { Tag, Sparkles } from 'lucide-react';
import { MathText } from '../../math/MathText';

export const ClassificationMiniPreview: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(22);

  // Classification logic: threshold at 15°C
  const isWarm = temperature >= 15;
  const predictedClass = isWarm ? '👕 Футболка и шорты' : '🧥 Теплая куртка и шапка';
  const classColor = isWarm ? '#3fb950' : '#58a6ff';

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#3fb950] uppercase">
            Интерактивный блок 2: Классификация
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Выбор категории (Класс А или Класс Б)</h3>
        </div>
        <span
          className="text-xs font-mono font-bold px-2.5 py-1 rounded border transition-colors"
          style={{ color: classColor, backgroundColor: `${classColor}15`, borderColor: `${classColor}40` }}
        >
          {isWarm ? 'Класс 1: Тепло' : 'Класс 2: Холодно'}
        </span>
      </div>

      <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#8b949e]">Входной признак: Температура на улице:</span>
            <span className="text-[#f0f6fc] font-bold">{temperature}°C</span>
          </div>
          <input
            type="range"
            min="-10"
            max="35"
            step="1"
            value={temperature}
            onChange={e => setTemperature(Number(e.target.value))}
            className="w-full accent-[#3fb950] cursor-pointer"
          />
        </div>

        {/* Visual decision bar */}
        <div className="relative h-12 rounded-lg bg-[#161b22] border border-[#30363d] overflow-hidden flex items-center px-4">
          <div className="absolute inset-y-0 left-0 w-[55%] bg-[#58a6ff]/15 flex items-center px-3 text-[10px] font-mono text-[#58a6ff]">
            Зона «Куртка» (&lt; 15°C)
          </div>
          <div className="absolute inset-y-0 right-0 w-[45%] bg-[#3fb950]/15 flex items-center justify-end px-3 text-[10px] font-mono text-[#3fb950]">
            Зона «Футболка» (≥ 15°C)
          </div>
          {/* Threshold marker */}
          <div className="absolute top-0 bottom-0 left-[55%] w-0.5 bg-[#f85149]" />

          {/* Current Temperature Indicator */}
          <div
            className="absolute -translate-x-1/2 p-1.5 rounded-md bg-[#21262d] border border-[#f0f6fc] text-xs font-bold text-[#f0f6fc] shadow-lg transition-all duration-150 flex items-center gap-1"
            style={{ left: `${Math.max(8, Math.min(92, ((temperature + 10) / 45) * 100))}%` }}
          >
            <span>{temperature}°C</span>
          </div>
        </div>

        <div className="p-3 rounded bg-[#161b22] border border-[#30363d] flex items-center justify-between text-xs font-mono">
          <span className="text-[#8b949e]">Решение модели:</span>
          <span className="text-sm font-bold text-[#f0f6fc]">{predictedClass}</span>
        </div>

        <p className="text-xs text-[#8b949e] leading-relaxed">
          В классификации модель не считает формулу, а <strong>принимает решение</strong>: к какой из готовых категорий отнести объект.
        </p>
      </div>
    </div>
  );
};
