import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';
import { CheckCircle2, HelpCircle } from 'lucide-react';

export const SingleFeatureRegressionTracer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [xVal, setXVal] = useState<number>(2.0);
  const [targetX, setTargetX] = useState<number>(3.5);
  const [showTask, setShowTask] = useState<boolean>(true);

  // Linear Regression Model with 1 Feature: y = 1.8x + 0.5
  const k = 1.8;
  const b = 0.5;
  const currentY = k * xVal + b;
  const targetY = k * targetX + b;

  const isTaskSolved = Math.abs(xVal - targetX) < 0.05;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 28;
    const centerX = 50;
    const centerY = height - 50;

    ctx.clearRect(0, 0, width, height);

    // Symmetrical Grid from origin
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    for (let x = centerX; x <= width; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = centerY; y >= 0; y -= scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#484f58';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height);
    ctx.stroke();

    ctx.fillStyle = '#8b949e';
    ctx.font = '10px monospace';
    ctx.fillText('X (Входной признак)', width - 120, centerY - 6);
    ctx.fillText('Y (Прогноз)', centerX + 6, 14);

    // Regression Line y = 1.8x + 0.5
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const xMax = 8;
    ctx.moveTo(centerX, centerY - b * scale);
    ctx.lineTo(centerX + xMax * scale, centerY - (k * xMax + b) * scale);
    ctx.stroke();

    // Projected point coordinates
    const px = centerX + xVal * scale;
    const py = centerY - currentY * scale;

    // Gold dashed projection lines to axes (Just like user photo!)
    ctx.strokeStyle = '#d29922';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, centerY);
    ctx.lineTo(px, py);
    ctx.lineTo(centerX, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glowing point dot
    ctx.fillStyle = 'rgba(210, 153, 34, 0.25)';
    ctx.beginPath();
    ctx.arc(px, py, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d29922';
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Axis projection ticks
    ctx.fillStyle = '#58a6ff';
    ctx.beginPath();
    ctx.arc(px, centerY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3fb950';
    ctx.beginPath();
    ctx.arc(centerX, py, 3.5, 0, Math.PI * 2);
    ctx.fill();

  }, [xVal, currentY]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Эксперимент 1 (1 Признак X)
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Трассировщик регрессии: Вход x → Выход y</h3>
        </div>

        {/* Task toggle */}
        <button
          onClick={() => {
            const nextX = Math.round((Math.random() * 4 + 1) * 10) / 10;
            setTargetX(nextX);
          }}
          className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-xs font-mono text-[#58a6ff] border border-[#30363d] transition-colors"
        >
          Новое задание 🎯
        </button>
      </div>

      {/* Quest Banner */}
      <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
        isTaskSolved ? 'bg-[#238636]/15 border-[#2ea043] text-[#3fb950]' : 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]'
      }`}>
        <span>
          🎯 <strong>Задание:</strong> Найди значение <strong className="text-[#3fb950]">y</strong>, если входной признак <strong className="text-[#58a6ff]">x = {targetX}</strong>!
        </span>
        {isTaskSolved ? (
          <span className="flex items-center gap-1 font-bold text-[#3fb950]">
            <CheckCircle2 className="w-4 h-4" /> Верно: y = {targetY.toFixed(2)}
          </span>
        ) : (
          <span className="text-[#8b949e]">Двигай ползунок</span>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* Canvas */}
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto aspect-[3/2] block" />
          <div className="absolute top-2.5 left-2.5 bg-[#161b22]/90 backdrop-blur-md px-2 py-1 rounded border border-[#30363d] text-xs font-mono text-[#58a6ff]">
            y = 1.8x + 0.5
          </div>
        </div>

        {/* Controls exactly like the user screenshot! */}
        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Входной аргумент X:</span>
              <span className="text-[#58a6ff] font-bold">{xVal.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.1"
              value={xVal}
              onChange={e => setXVal(parseFloat(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
              <span className="text-[10px] text-[#8b949e] block">Координата X</span>
              <span className="text-sm font-bold text-[#58a6ff]">{xVal.toFixed(1)}</span>
            </div>
            <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
              <span className="text-[10px] text-[#8b949e] block">Вычисленный Y</span>
              <span className="text-sm font-bold text-[#3fb950]">{currentY.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] text-xs text-[#8b949e] leading-relaxed">
            <MathText text="Точка $(x, y)$ двигается строго по прямой линии. Задавая ровно 1 параметр $x$, регрессия дает точный прогноз $y$." />
          </div>
        </div>
      </div>
    </div>
  );
};
