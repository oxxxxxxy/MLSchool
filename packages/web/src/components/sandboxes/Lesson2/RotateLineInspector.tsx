import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { MathText } from '../../math/MathText';

export const RotateLineInspector: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState<number>(2.0);
  const [quest, setQuest] = useState<number>(0);

  const quests = [
    { title: 'Сделай возрастающую прямую (k > 0)', check: (k: number) => k > 0.5 },
    { title: 'Сделай убывающую прямую (k < 0)', check: (k: number) => k < -0.5 },
    { title: 'Выставь прямую с подъемом 2 на шаг 1 (k = 2)', check: (k: number) => Math.abs(k - 2.0) < 0.1 },
    { title: 'Сделай строго горизонтальную линию (k = 0)', check: (k: number) => Math.abs(k) < 0.1 }
  ];

  const currentQuest = quests[quest];
  const isQuestDone = currentQuest.check(k);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 28;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Symmetrical Grid
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    for (let x = centerX; x <= width; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let x = centerX; x >= 0; x -= scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = centerY; y <= height; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
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
    ctx.fillText('X', width - 14, centerY - 6);
    ctx.fillText('Y', centerX + 6, 14);

    // Line y = kx
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const xMin = -centerX / scale;
    const xMax = (width - centerX) / scale;
    ctx.moveTo(centerX + xMin * scale, centerY - (k * xMin) * scale);
    ctx.lineTo(centerX + xMax * scale, centerY - (k * xMax) * scale);
    ctx.stroke();

    // Triangle step: Δx = 1, Δy = k starting from x = 1
    const startX = 1;
    const p1x = centerX + startX * scale;
    const p1y = centerY - (k * startX) * scale;
    const p2x = centerX + (startX + 1) * scale;
    const p2y = p1y;
    const p3x = p2x;
    const p3y = centerY - (k * (startX + 1)) * scale;

    // Fill triangle
    ctx.fillStyle = 'rgba(210, 153, 34, 0.15)';
    ctx.beginPath();
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.lineTo(p3x, p3y);
    ctx.closePath();
    ctx.fill();

    // Triangle lines
    ctx.strokeStyle = '#d29922';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.lineTo(p3x, p3y);
    ctx.stroke();

    // Labels for triangle
    ctx.fillStyle = '#d29922';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('Δx = 1', p1x + scale * 0.2, p1y + (k >= 0 ? 14 : -6));
    ctx.fillText(`Δy = ${k.toFixed(1)}`, p2x + 6, (p2y + p3y) / 2 + 4);

  }, [k]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Интерактив: Поверни прямую</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Коэффициент k отвечает за наклон (крутизну)</h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#58a6ff] bg-[#0d1117] px-2.5 py-1 rounded border border-[#30363d]">
          y = {k.toFixed(1)}x
        </span>
      </div>

      {/* Mini-Quest Banner */}
      <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
        isQuestDone ? 'bg-[#238636]/15 border-[#2ea043] text-[#3fb950]' : 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]'
      }`}>
        <div className="flex items-center gap-2">
          {isQuestDone && <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#3fb950]" />}
          <span>🎯 <strong>Мини-квест:</strong> {currentQuest.title}</span>
        </div>
        {isQuestDone && (
          <button
            onClick={() => setQuest((quest + 1) % quests.length)}
            className="px-2.5 py-1 rounded bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-mono transition-colors"
          >
            Следующий квест ➔
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto aspect-[3/2] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Наклон прямой (k):</span>
              <span className="text-[#58a6ff] font-bold">{k.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-5.0"
              max="5.0"
              step="0.1"
              value={k}
              onChange={e => setK(parseFloat(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] text-xs text-[#8b949e] space-y-1.5 leading-relaxed">
            <div>• <strong className="text-[#3fb950]">k &gt; 0</strong> — прямая идет в гору (возрастает).</div>
            <div>• <strong className="text-[#f85149]">k &lt; 0</strong> — прямая катится с горки (убывает).</div>
            <div>• <strong className="text-[#d29922]">k = 0</strong> — идеально ровный горизонтальный стол.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
