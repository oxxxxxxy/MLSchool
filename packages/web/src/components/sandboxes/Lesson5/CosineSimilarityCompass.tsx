import React, { useState } from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';

export const CosineSimilarityCompass: React.FC = () => {
  const [angle1, setAngle1] = useState<number>(30);
  const [angle2, setAngle2] = useState<number>(75);

  const diffDeg = Math.abs(angle1 - angle2);
  const diffRad = (diffDeg * Math.PI) / 180;
  const similarity = Math.cos(diffRad);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div>
        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
          Интерактивный эксперимент 2
        </span>
        <h3 className="text-lg font-bold text-white">Компас Схожести: Cosine Similarity</h3>
        <p className="text-xs text-slate-400 mt-1">
          Так ChatGPT и поисковые системы определяют, насколько похожи по смыслу два текста или две картинки.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Compass Visual Canvas */}
        <div className="relative w-64 h-64 mx-auto rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center shadow-inner">
          <div className="absolute inset-2 rounded-full border border-slate-800/60" />
          <div className="absolute inset-8 rounded-full border border-slate-800/40" />

          {/* Needle 1 (Indigo) */}
          <div
            className="absolute w-1 h-28 bg-gradient-to-t from-transparent via-indigo-500 to-indigo-400 rounded-full origin-bottom shadow-lg shadow-indigo-500/50"
            style={{
              bottom: '50%',
              left: 'calc(50% - 2px)',
              transform: `rotate(${angle1}deg)`
            }}
          />

          {/* Needle 2 (Emerald) */}
          <div
            className="absolute w-1 h-28 bg-gradient-to-t from-transparent via-emerald-500 to-emerald-400 rounded-full origin-bottom shadow-lg shadow-emerald-500/50"
            style={{
              bottom: '50%',
              left: 'calc(50% - 2px)',
              transform: `rotate(${angle2}deg)`
            }}
          />

          {/* Center Pin */}
          <div className="w-6 h-6 rounded-full bg-white shadow-md z-10 ring-4 ring-slate-900 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-900" />
          </div>
        </div>

        {/* Sliders & Similarity Score */}
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-indigo-400">Стрелка 1 (Текст A):</span>
              <span className="font-mono text-slate-300">{angle1}°</span>
            </div>
            <input type="range" min="0" max="360" value={angle1} onChange={e => setAngle1(Number(e.target.value))} className="w-full accent-indigo-500" />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-400">Стрелка 2 (Текст B):</span>
              <span className="font-mono text-slate-300">{angle2}°</span>
            </div>
            <input type="range" min="0" max="360" value={angle2} onChange={e => setAngle2(Number(e.target.value))} className="w-full accent-emerald-500" />
          </div>

          <div className={`p-4 rounded-2xl border text-center transition-all ${
            similarity > 0.8
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : similarity > 0.2
              ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300'
              : similarity > -0.2
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}>
            <span className="text-[10px] uppercase font-bold tracking-wider block">
              Косинус угла (Схожесть смыслов)
            </span>
            <div className="text-3xl font-black font-mono mt-1">
              cos({diffDeg.toFixed(0)}°) = {similarity.toFixed(2)}
            </div>
            <span className="text-xs font-medium mt-1 block">
              {similarity > 0.85
                ? '✨ 100% совпадение темы (Стрелки сонаправлены!)'
                : similarity > 0.3
                ? '👍 Частично похожие объекты'
                : similarity > -0.3
                ? '⚪ Независимые объекты (Угол ~90°)'
                : '🔴 Полная противоположность'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
