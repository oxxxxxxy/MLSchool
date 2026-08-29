import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

interface Point {
  x: number;
  y: number;
  label: string;
}

export const TwoPointsLineDrag: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ptA, setPtA] = useState<Point>({ x: -2, y: -1, label: 'A' });
  const [ptB, setPtB] = useState<Point>({ x: 3, y: 3, label: 'B' });
  const [dragged, setDragged] = useState<'A' | 'B' | null>(null);

  const dx = ptB.x - ptA.x;
  const dy = ptB.y - ptA.y;
  const isVertical = Math.abs(dx) < 0.001;
  const k = !isVertical ? dy / dx : null;
  const b = k !== null ? ptA.y - k * ptA.x : null;

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

    ctx.fillStyle = '#8b949e';
    ctx.font = '10px monospace';
    ctx.fillText('X', width - 14, centerY - 6);
    ctx.fillText('Y', centerX + 6, 14);

    const aPx = centerX + ptA.x * scale;
    const aPy = centerY - ptA.y * scale;
    const bPx = centerX + ptB.x * scale;
    const bPy = centerY - ptB.y * scale;

    // Line through 2 points
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (isVertical) {
      ctx.moveTo(aPx, 0);
      ctx.lineTo(aPx, height);
    } else if (k !== null && b !== null) {
      const xMin = -centerX / scale;
      const xMax = (width - centerX) / scale;
      ctx.moveTo(centerX + xMin * scale, centerY - (k * xMin + b) * scale);
      ctx.lineTo(centerX + xMax * scale, centerY - (k * xMax + b) * scale);
    }
    ctx.stroke();

    // Triangle Δx, Δy
    ctx.strokeStyle = '#d29922';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(aPx, aPy);
    ctx.lineTo(bPx, aPy);
    ctx.lineTo(bPx, bPy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Points
    [ptA, ptB].forEach(pt => {
      const px = centerX + pt.x * scale;
      const py = centerY - pt.y * scale;

      ctx.fillStyle = '#3fb950';
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#f0f6fc';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`${pt.label}(${pt.x}, ${pt.y})`, px + 10, py - 6);
    });

  }, [ptA, ptB, isVertical, k, b]);

  const handlePointerDown = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (clientY - rect.top) * (canvas.height / rect.height);
    const scale = 28;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const aPx = centerX + ptA.x * scale;
    const aPy = centerY - ptA.y * scale;
    const bPx = centerX + ptB.x * scale;
    const bPy = centerY - ptB.y * scale;

    if (Math.hypot(clickX - aPx, clickY - aPy) < 20) setDragged('A');
    else if (Math.hypot(clickX - bPx, clickY - bPy) < 20) setDragged('B');
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!dragged) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (clientY - rect.top) * (canvas.height / rect.height);
    const scale = 28;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const mathX = Math.round((clickX - centerX) / scale);
    const mathY = Math.round((centerY - clickY) / scale);

    if (dragged === 'A') setPtA(prev => ({ ...prev, x: mathX, y: mathY }));
    else if (dragged === 'B') setPtB(prev => ({ ...prev, x: mathX, y: mathY }));
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Интерактив: Прямая через две точки</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Зажми и тащи точки A и B прямо по экрану</h3>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0 cursor-grab active:cursor-grabbing touch-none">
          <canvas
            ref={canvasRef}
            width={480}
            height={320}
            onMouseDown={e => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={e => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={() => setDragged(null)}
            onMouseLeave={() => setDragged(null)}
            onTouchStart={e => e.touches.length === 1 && handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={e => e.touches.length === 1 && handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={() => setDragged(null)}
            className="w-full h-auto aspect-[3/2] block"
          />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#8b949e]">Смещение Δx = x₂ - x₁:</span>
              <span className="text-[#58a6ff] font-bold">{dx}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8b949e]">Смещение Δy = y₂ - y₁:</span>
              <span className="text-[#3fb950] font-bold">{dy}</span>
            </div>
            <div className="flex justify-between border-t border-[#21262d] pt-2">
              <span className="text-[#8b949e]">Наклон k = Δy / Δx:</span>
              <span className="text-[#d29922] font-bold">{isVertical ? 'Вертикальная (∞)' : k?.toFixed(2)}</span>
            </div>
          </div>

          {isVertical ? (
            <div className="p-2.5 rounded bg-[#da3633]/15 border border-[#f85149] text-xs font-mono text-[#f85149]">
              ⚠️ Вертикальную прямую (x₁ = x₂) нельзя записать как y = kx + b (деление на Δx = 0).
            </div>
          ) : (
            <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] text-center font-mono text-xs">
              <FormulaView latex={`y = ${k?.toFixed(2)}x ${b && b >= 0 ? `+ ${b.toFixed(2)}` : `- ${Math.abs(b || 0).toFixed(2)}`}`} displayMode={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
