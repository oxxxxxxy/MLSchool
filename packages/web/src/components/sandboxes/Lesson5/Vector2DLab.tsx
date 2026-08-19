import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';

export const Vector2DLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ux, setUx] = useState<number>(3);
  const [uy, setUy] = useState<number>(2);
  const [vx, setVx] = useState<number>(1);
  const [vy, setVy] = useState<number>(4);
  const [showSum, setShowSum] = useState<boolean>(true);

  const sumX = ux + vx;
  const sumY = uy + vy;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 25;
    const centerX = 60;
    const centerY = height - 60;

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

    const drawArrow = (fromX: number, fromY: number, toX: number, toY: number, color: string, label: string) => {
      const headlen = 10;
      const angle = Math.atan2(toY - fromY, toX - fromX);

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
      ctx.fill();

      // Label
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(label, toX + 8, toY - 8);
    };

    const pUx = centerX + ux * scale;
    const pUy = centerY - uy * scale;
    const pVx = centerX + vx * scale;
    const pVy = centerY - vy * scale;
    const pSumX = centerX + sumX * scale;
    const pSumY = centerY - sumY * scale;

    // Parallelogram ghost lines
    if (showSum) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(pUx, pUy);
      ctx.lineTo(pSumX, pSumY);
      ctx.moveTo(pVx, pVy);
      ctx.lineTo(pSumX, pSumY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Sum Vector u + v (Gold)
      drawArrow(centerX, centerY, pSumX, pSumY, '#f59e0b', `u + v = (${sumX}, ${sumY})`);
    }

    // Vector u (Indigo)
    drawArrow(centerX, centerY, pUx, pUy, '#6366f1', `u = (${ux}, ${uy})`);

    // Vector v (Emerald)
    drawArrow(centerX, centerY, pVx, pVy, '#10b981', `v = (${vx}, ${vy})`);

  }, [ux, uy, vx, vy, showSum, sumX, sumY]);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Интерактивный эксперимент 1
          </span>
          <h3 className="text-lg font-bold text-white">Векторная Лаборатория 2D</h3>
        </div>

        <button
          onClick={() => setShowSum(!showSum)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            showSum ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {showSum ? 'Скрыть сумму (u + v)' : 'Показать сумму (u + v)'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-inner">
          <canvas ref={canvasRef} width={460} height={300} className="w-full max-w-[460px] h-[300px] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
            <span className="text-xs font-bold text-indigo-300">Вектор u (Признак 1): [{ux}, {uy}]</span>
            <div className="grid grid-cols-2 gap-2">
              <input type="range" min="0" max="6" value={ux} onChange={e => setUx(Number(e.target.value))} className="accent-indigo-500" />
              <input type="range" min="0" max="6" value={uy} onChange={e => setUy(Number(e.target.value))} className="accent-indigo-500" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
            <span className="text-xs font-bold text-emerald-300">Вектор v (Признак 2): [{vx}, {vy}]</span>
            <div className="grid grid-cols-2 gap-2">
              <input type="range" min="0" max="6" value={vx} onChange={e => setVx(Number(e.target.value))} className="accent-emerald-500" />
              <input type="range" min="0" max="6" value={vy} onChange={e => setVy(Number(e.target.value))} className="accent-emerald-500" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
            <span className="font-bold">Сложение векторов: </span>
            <FormulaView latex={`\\vec{u} + \\vec{v} = \\begin{pmatrix} ${ux} + ${vx} \\\\ ${uy} + ${vy} \\end{pmatrix} = \\begin{pmatrix} ${sumX} \\\\ ${sumY} \\end{pmatrix}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
