import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Magnet } from 'lucide-react';
import { MathText } from '../../math/MathText';

interface DataPoint {
  id: number;
  x: number;
  y: number;
}

interface MagnetCenter {
  id: number;
  x: number;
  y: number;
  color: string;
  name: string;
}

const STATIC_DOTS: DataPoint[] = [
  { id: 1, x: -3.0, y: 1.5 }, { id: 2, x: -2.2, y: 2.2 }, { id: 3, x: -2.8, y: 0.8 }, { id: 4, x: -1.5, y: 1.8 },
  { id: 5, x: 2.5, y: 2.0 }, { id: 6, x: 3.2, y: 1.2 }, { id: 7, x: 2.0, y: 1.5 }, { id: 8, x: 2.8, y: 2.5 },
  { id: 9, x: -0.2, y: -2.0 }, { id: 10, x: -1.0, y: -1.5 }, { id: 11, x: 0.8, y: -2.2 }, { id: 12, x: 0.2, y: -1.2 },
  { id: 13, x: -1.8, y: -0.5 }, { id: 14, x: 1.5, y: -0.5 }, { id: 15, x: 0.0, y: 0.5 }
];

export const CentroidMagnetClustering: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [numK, setNumK] = useState<number>(3); // 2 or 3
  const [magnets, setMagnets] = useState<MagnetCenter[]>([
    { id: 1, x: -2.0, y: 1.5, color: '#58a6ff', name: 'Магнит 1 (Синий)' },
    { id: 2, x: 2.5, y: 1.5, color: '#3fb950', name: 'Магнит 2 (Зеленый)' },
    { id: 3, x: 0.0, y: -1.8, color: '#f85149', name: 'Магнит 3 (Красный)' }
  ]);
  const [draggedMagnetId, setDraggedMagnetId] = useState<number | null>(null);

  const activeMagnets = magnets.slice(0, numK);

  // Assign each point to closest magnet
  const getClosestMagnet = (dot: DataPoint) => {
    let bestDist = Infinity;
    let bestMag = activeMagnets[0];
    activeMagnets.forEach(m => {
      const dist = Math.hypot(dot.x - m.x, dot.y - m.y);
      if (dist < bestDist) {
        bestDist = dist;
        bestMag = m;
      }
    });
    return bestMag;
  };

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

    // Background Grid
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

    // Connecting lines from points to closest magnet
    STATIC_DOTS.forEach(dot => {
      const mag = getClosestMagnet(dot);
      const dotPx = centerX + dot.x * scale;
      const dotPy = centerY - dot.y * scale;
      const magPx = centerX + mag.x * scale;
      const magPy = centerY - mag.y * scale;

      ctx.strokeStyle = `${mag.color}33`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(dotPx, dotPy);
      ctx.lineTo(magPx, magPy);
      ctx.stroke();
    });

    // Draw Data Points (Colored by closest magnet)
    STATIC_DOTS.forEach(dot => {
      const mag = getClosestMagnet(dot);
      const px = centerX + dot.x * scale;
      const py = centerY - dot.y * scale;

      ctx.fillStyle = mag.color;
      ctx.beginPath();
      ctx.arc(px, py, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Draw Magnets (Centroids) - Large Draggable Targets
    activeMagnets.forEach(m => {
      const px = centerX + m.x * scale;
      const py = centerY - m.y * scale;

      // Glow halo
      ctx.fillStyle = `${m.color}22`;
      ctx.beginPath();
      ctx.arc(px, py, 20, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring
      ctx.strokeStyle = m.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(px, py, 12, 0, Math.PI * 2);
      ctx.stroke();

      // Core
      ctx.fillStyle = '#f0f6fc';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = m.color;
      ctx.fillText(`Магнит ${m.id}`, px + 16, py - 4);
    });

  }, [magnets, numK, activeMagnets]);

  const handlePointerDown = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (clientY - rect.top) * (canvas.height / rect.height);

    const scale = 28;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    activeMagnets.forEach(m => {
      const mPx = centerX + m.x * scale;
      const mPy = centerY - m.y * scale;
      if (Math.hypot(clickX - mPx, clickY - mPy) < 25) {
        setDraggedMagnetId(m.id);
      }
    });
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!draggedMagnetId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (clientY - rect.top) * (canvas.height / rect.height);

    const scale = 28;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const mathX = Math.round(((clickX - centerX) / scale) * 10) / 10;
    const mathY = Math.round(((centerY - clickY) / scale) * 10) / 10;

    setMagnets(prev => prev.map(m => m.id === draggedMagnetId ? { ...m, x: mathX, y: mathY } : m));
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#bc8cff] uppercase">
            Эксперимент 1 (Принцип K-Means)
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Магниты-Центроиды: Двигай магниты мышкой!</h3>
        </div>

        <div className="flex gap-1 bg-[#0d1117] p-1 rounded-md border border-[#30363d] text-xs font-mono">
          {[2, 3].map(k => (
            <button
              key={k}
              onClick={() => setNumK(k)}
              className={`px-3 py-1 rounded transition-colors ${
                numK === k
                  ? 'bg-[#21262d] text-[#58a6ff] font-bold border border-[#30363d]'
                  : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              {k} Магнита (K={k})
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* Canvas with Touch & Mouse support */}
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0 cursor-grab active:cursor-grabbing touch-none">
          <canvas
            ref={canvasRef}
            width={480}
            height={320}
            onMouseDown={e => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={e => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={() => setDraggedMagnetId(null)}
            onMouseLeave={() => setDraggedMagnetId(null)}
            onTouchStart={e => e.touches.length === 1 && handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={e => e.touches.length === 1 && handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={() => setDraggedMagnetId(null)}
            className="w-full h-auto aspect-[3/2] block"
          />
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-[#8b949e] bg-[#161b22]/90 px-2 py-0.5 rounded border border-[#30363d]">
            🧲 Зажми и тащи Магнит: точки сами перекрашиваются
          </div>
        </div>

        <div className="flex-1 w-full space-y-3 text-xs text-[#8b949e] leading-relaxed">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1.5">
            <span className="font-semibold text-[#f0f6fc] block">Как работает кластеризация K-Means:</span>
            <p>
              1. Ставим $K$ центров-магнитов.<br />
              2. Каждая точка притягивается к <strong>самому близкому магниту</strong> и окрашивается в его цвет.<br />
              3. Никаких меток заранее нет — всё решает простое геометрическое расстояние!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
