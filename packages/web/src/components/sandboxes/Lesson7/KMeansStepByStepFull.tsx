import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { MathText } from '../../math/MathText';

interface DataPoint {
  id: number;
  x: number;
  y: number;
  cluster: number; // -1 if unassigned
}

interface Centroid {
  id: number;
  x: number;
  y: number;
  oldX?: number;
  oldY?: number;
  color: string;
}

const STATIC_POINTS: DataPoint[] = [
  // Cluster A (top-left)
  { id: 1, x: -3.0, y: 2.0, cluster: -1 }, { id: 2, x: -2.2, y: 2.5, cluster: -1 }, { id: 3, x: -2.8, y: 1.2, cluster: -1 }, { id: 4, x: -1.8, y: 1.8, cluster: -1 },
  // Cluster B (right)
  { id: 5, x: 2.5, y: 1.5, cluster: -1 }, { id: 6, x: 3.2, y: 0.8, cluster: -1 }, { id: 7, x: 2.0, y: 1.0, cluster: -1 }, { id: 8, x: 2.8, y: 2.2, cluster: -1 },
  // Cluster C (bottom)
  { id: 9, x: -0.5, y: -2.0, cluster: -1 }, { id: 10, x: -1.2, y: -1.5, cluster: -1 }, { id: 11, x: 0.8, y: -2.2, cluster: -1 }, { id: 12, x: 0.2, y: -1.2, cluster: -1 }
];

export const KMeansStepByStepFull: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<DataPoint[]>(STATIC_POINTS);
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [step, setStep] = useState<'init' | 'assign' | 'move'>('init');
  const [iteration, setIteration] = useState(0);

  // Initialize 3 random centroids
  const handleInit = () => {
    setCentroids([
      { id: 0, x: -2.0, y: 0.0, color: '#58a6ff' },
      { id: 1, x: 1.5, y: -1.0, color: '#3fb950' },
      { id: 2, x: 0.0, y: 2.0, color: '#f85149' }
    ]);
    setPoints(STATIC_POINTS.map(p => ({ ...p, cluster: -1 })));
    setStep('assign');
    setIteration(1);
  };

  // Step 1: Assign each point to nearest centroid
  const handleAssign = () => {
    if (centroids.length === 0) return;
    setPoints(prev => prev.map(pt => {
      let minDist = Infinity;
      let closestCluster = 0;
      centroids.forEach(c => {
        const d = Math.hypot(pt.x - c.x, pt.y - c.y);
        if (d < minDist) {
          minDist = d;
          closestCluster = c.id;
        }
      });
      return { ...pt, cluster: closestCluster };
    }));
    setStep('move');
  };

  // Step 2: Move each centroid to the mean position of its assigned points
  const handleMove = () => {
    setCentroids(prev => prev.map(c => {
      const assigned = points.filter(p => p.cluster === c.id);
      if (assigned.length === 0) return c;
      const meanX = assigned.reduce((acc, p) => acc + p.x, 0) / assigned.length;
      const meanY = assigned.reduce((acc, p) => acc + p.y, 0) / assigned.length;
      return {
        ...c,
        oldX: c.x,
        oldY: c.y,
        x: Number(meanX.toFixed(2)),
        y: Number(meanY.toFixed(2))
      };
    }));
    setStep('assign');
    setIteration(prev => prev + 1);
  };

  const handleRunToEnd = () => {
    handleInit();
    setTimeout(() => {
      handleAssign();
      setTimeout(() => {
        handleMove();
        setTimeout(() => {
          handleAssign();
          setTimeout(() => {
            handleMove();
          }, 300);
        }, 300);
      }, 300);
    }, 300);
  };

  useEffect(() => {
    handleInit();
  }, []);

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

    // Grid
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

    // Draw connecting lines from points to assigned centroids
    points.forEach(pt => {
      if (pt.cluster >= 0) {
        const c = centroids.find(cent => cent.id === pt.cluster);
        if (c) {
          ctx.strokeStyle = `${c.color}25`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(centerX + pt.x * scale, centerY - pt.y * scale);
          ctx.lineTo(centerX + c.x * scale, centerY - c.y * scale);
          ctx.stroke();
        }
      }
    });

    // Draw points
    points.forEach(pt => {
      const px = centerX + pt.x * scale;
      const py = centerY - pt.y * scale;
      const c = pt.cluster >= 0 ? centroids.find(cent => cent.id === pt.cluster) : null;
      const color = c ? c.color : '#8b949e';

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Draw centroids & motion arrows from old position
    centroids.forEach(c => {
      const px = centerX + c.x * scale;
      const py = centerY - c.y * scale;

      // Draw ghost previous position if moved
      if (c.oldX !== undefined && c.oldY !== undefined) {
        const oldPx = centerX + c.oldX * scale;
        const oldPy = centerY - c.oldY * scale;

        ctx.fillStyle = `${c.color}22`;
        ctx.beginPath();
        ctx.arc(oldPx, oldPy, 9, 0, Math.PI * 2);
        ctx.fill();

        // Arrow
        ctx.strokeStyle = `${c.color}66`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(oldPx, oldPy);
        ctx.lineTo(px, py);
        ctx.stroke();
      }

      // Centroid glow
      ctx.fillStyle = `${c.color}33`;
      ctx.beginPath();
      ctx.arc(px, py, 18, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(px, py, 11, 0, Math.PI * 2);
      ctx.stroke();

      // Core
      ctx.fillStyle = '#f0f6fc';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = c.color;
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`Центр ${c.id + 1}`, px + 14, py - 4);
    });

  }, [points, centroids]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#bc8cff] uppercase">Пошаговый алгоритм K-Means</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Итерация {iteration}: {step === 'assign' ? '1. Распределить точки по центрам' : '2. Переместить центры в среднее положение'}</h3>
        </div>
        <button onClick={handleInit} className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d]">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto aspect-[3/2] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAssign}
              disabled={step !== 'assign'}
              className="py-2 px-3 rounded bg-[#21262d] hover:bg-[#30363d] disabled:opacity-40 text-xs font-mono font-bold text-[#58a6ff] border border-[#30363d] transition-colors"
            >
              1. Распределить точки
            </button>
            <button
              onClick={handleMove}
              disabled={step !== 'move'}
              className="py-2 px-3 rounded bg-[#21262d] hover:bg-[#30363d] disabled:opacity-40 text-xs font-mono font-bold text-[#3fb950] border border-[#30363d] transition-colors"
            >
              2. Переместить центры
            </button>
          </div>

          <button
            onClick={handleRunToEnd}
            className="w-full py-2 rounded bg-[#238636] hover:bg-[#2ea043] text-white font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Выполнить обучение до конца</span>
          </button>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] text-xs text-[#8b949e] space-y-1 leading-relaxed">
            <span className="text-[#f0f6fc] font-semibold block">5 шагов K-Means:</span>
            1. Выбираем $K=3$ центра.<br />
            2. Каждая точка выбирает ближайший центр.<br />
            3. Центры перемещаются в среднее положение своих точек.<br />
            4. Повторяем, пока центры не перестанут двигаться.
          </div>
        </div>
      </div>
    </div>
  );
};
