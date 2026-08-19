import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { PlusCircle, RotateCcw } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

export const LinearLab2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState<number>(1.5);
  const [b, setB] = useState<number>(1.0);
  const [points, setPoints] = useState<Point[]>([
    { x: -3, y: -3.5 },
    { x: -1, y: -0.5 },
    { x: 1, y: 2.5 },
    { x: 3, y: 5.5 }
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 30; // 30 px = 1 unit
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Line y = kx + b
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    const xMin = -centerX / scale;
    const xMax = (width - centerX) / scale;
    const yAtMin = k * xMin + b;
    const yAtMax = k * xMax + b;

    ctx.moveTo(centerX + xMin * scale, centerY - yAtMin * scale);
    ctx.lineTo(centerX + xMax * scale, centerY - yAtMax * scale);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Intercept Point (0, b)
    const interceptPy = centerY - b * scale;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(centerX, interceptPy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Data points and residual lines
    points.forEach((p) => {
      const px = centerX + p.x * scale;
      const py = centerY - p.y * scale;
      const predY = k * p.x + b;
      const predPy = centerY - predY * scale;

      // Residual dashed line
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, predPy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point circle
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

  }, [k, b, points]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const scale = 30;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const mathX = Math.round(((clickX - centerX) / scale) * 10) / 10;
    const mathY = Math.round(((centerY - clickY) / scale) * 10) / 10;

    setPoints(prev => [...prev, { x: mathX, y: mathY }]);
  };

  const formulaLatex = `y = ${k.toFixed(1)}x ${b >= 0 ? '+ ' + b.toFixed(1) : '- ' + Math.abs(b).toFixed(1)}`;

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Интерактивный эксперимент 1
          </span>
          <h3 className="text-lg font-bold text-white">Лаборатория Прямой Линии</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPoints([])}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Очистить точки
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Canvas */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-inner cursor-crosshair">
          <canvas
            ref={canvasRef}
            width={480}
            height={320}
            onClick={handleCanvasClick}
            className="w-full max-w-[480px] h-[320px] block"
          />
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sky-500/30 text-xs font-bold text-sky-300">
            <FormulaView latex={formulaLatex} />
          </div>
          <div className="absolute bottom-2 right-3 text-[10px] text-slate-500 pointer-events-none">
            💡 Кликни по холсту, чтобы добавить точку данных
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 w-full space-y-4">
          {/* Slope k */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-sky-300">Наклон k (Вес / Крутизна):</span>
              <span className="text-sky-400 font-mono text-sm">{k.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.1"
              value={k}
              onChange={(e) => setK(parseFloat(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Спуск (-4)</span>
              <span>Плоско (0)</span>
              <span>Крутой подъем (+4)</span>
            </div>
          </div>

          {/* Bias b */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-amber-300">Сдвиг b (Стартовая высота / Bias):</span>
              <span className="text-amber-400 font-mono text-sm">{b.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.2"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            🔵 <strong>Секрет ИИ:</strong> Красные пунктирные линии — это ошибки модели (Residuals). Машинное обучение автоматически настраивает $k$ и $b$, чтобы суммарная длина этих красных отрезков стала минимальной!
          </div>
        </div>
      </div>
    </div>
  );
};
