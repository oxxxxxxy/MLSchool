import React, { useState } from 'react';
import { Play, Sparkles, Cpu, CheckCircle2 } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';

export const ReactFlowComputeGraph: React.FC = () => {
  const [x1, setX1] = useState<number>(2);
  const [x2, setX2] = useState<number>(3);
  const [w1, setW1] = useState<number>(1.5);
  const [w2, setW2] = useState<number>(-0.5);
  const [bias, setBias] = useState<number>(1.0);

  const term1 = x1 * w1;
  const term2 = x2 * w2;
  const zSum = term1 + term2 + bias;
  // Activation ReLU: max(0, z)
  const outputY = Math.max(0, zSum);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
            Интерактивный вычислительный граф
          </span>
          <h3 className="text-lg font-bold text-white">Вычислительный Граф Искусственного Нейрона</h3>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-bold">
          <Cpu className="w-4 h-4" />
          <span>Архитектура прямого прохода (Forward Pass)</span>
        </div>
      </div>

      {/* Visual Compute Graph Nodes */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 overflow-x-auto">
        {/* Layer 1: Inputs */}
        <div className="flex flex-col gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 text-center w-36 shadow-lg">
            <span className="text-[10px] uppercase font-bold text-indigo-400 block">Вход x1 (Площадь)</span>
            <div className="text-xl font-black font-mono text-white mt-0.5">{x1}</div>
            <input type="range" min="0" max="5" value={x1} onChange={e => setX1(Number(e.target.value))} className="w-full accent-indigo-500 mt-1" />
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 text-center w-36 shadow-lg">
            <span className="text-[10px] uppercase font-bold text-indigo-400 block">Вход x2 (Комнаты)</span>
            <div className="text-xl font-black font-mono text-white mt-0.5">{x2}</div>
            <input type="range" min="0" max="5" value={x2} onChange={e => setX2(Number(e.target.value))} className="w-full accent-indigo-500 mt-1" />
          </div>
        </div>

        {/* Weights & Connections */}
        <div className="flex flex-col gap-6 text-center text-xs font-mono">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 shadow-sm">
            <span className="text-[10px] text-slate-500 block font-sans">Вес связи w1:</span>
            <span>× {w1.toFixed(1)} = {term1.toFixed(1)}</span>
            <input type="range" min="-2" max="3" step="0.5" value={w1} onChange={e => setW1(Number(e.target.value))} className="w-24 accent-sky-500 block mt-1" />
          </div>

          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 shadow-sm">
            <span className="text-[10px] text-slate-500 block font-sans">Вес связи w2:</span>
            <span>× {w2.toFixed(1)} = {term2.toFixed(1)}</span>
            <input type="range" min="-2" max="3" step="0.5" value={w2} onChange={e => setW2(Number(e.target.value))} className="w-24 accent-sky-500 block mt-1" />
          </div>
        </div>

        {/* Layer 2: Sum Node */}
        <div className="p-4 rounded-3xl bg-gradient-to-tr from-purple-900/60 to-indigo-900/60 border-2 border-purple-500/50 text-center w-40 shadow-xl shadow-purple-500/10">
          <span className="text-[10px] uppercase font-black text-purple-300 block">Сумматор Σ + b</span>
          <div className="text-2xl font-black font-mono text-white mt-1">z = {zSum.toFixed(1)}</div>
          <div className="mt-2 text-[10px] text-slate-400">
            Сдвиг b: <strong className="text-amber-400">{bias}</strong>
            <input type="range" min="-3" max="3" value={bias} onChange={e => setBias(Number(e.target.value))} className="w-full accent-amber-500 mt-0.5" />
          </div>
        </div>

        {/* Arrow */}
        <div className="text-pink-400 font-bold text-xs">
          ReLU(z) →
        </div>

        {/* Layer 3: Output Node */}
        <div className="p-5 rounded-3xl bg-gradient-to-tr from-emerald-950/80 to-teal-900/80 border-2 border-emerald-500/60 text-center w-40 shadow-2xl shadow-emerald-500/20">
          <span className="text-[10px] uppercase font-black text-emerald-400 block">Прогноз ŷ</span>
          <div className="text-3xl font-black font-mono text-emerald-300 mt-1">{outputY.toFixed(2)}</div>
          <span className="text-[10px] text-slate-400 block mt-1">Финальный выход</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
        🧠 <strong>Поздравляем:</strong> Ты только что вручную управлял настоящим вычислительным графом искусственного нейрона! Из таких кирпичиков строятся GPT-4, автопилоты Tesla и нейросети для распознавания лиц.
      </div>
    </div>
  );
};
