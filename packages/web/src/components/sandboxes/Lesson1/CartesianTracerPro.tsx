import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

type FuncMode = 'y=x' | 'y=2x+1' | 'y=x^2' | 'y=10/x';

export const CartesianTracerPro: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [funcMode, setFuncMode] = useState<FuncMode>('y=2x+1');
  const [xVal, setXVal] = useState<number>(2.0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const evalFunc = (x: number): number | null => {
    switch (funcMode) {
      case 'y=x': return x;
      case 'y=2x+1': return 2 * x + 1;
      case 'y=x^2': return x * x;
      case 'y=10/x': return x === 0 ? null : 10 / x;
    }
  };

  useEffect(() => {
    let animId: number;
    if (isAutoPlaying) {
      let curX = -4.0;
      const step = () => {
        curX += 0.08;
        if (curX > 4.0) {
          setIsAutoPlaying(false);
          setXVal(4.0);
        } else {
          setXVal(Number(curX.toFixed(2)));
          animId = requestAnimationFrame(step);
        }
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isAutoPlaying]);

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

    // Full Ghost Curve
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= width; px += 2) {
      const mathX = (px - centerX) / scale;
      const mathY = evalFunc(mathX);
      if (mathY !== null && Math.abs(mathY) < 15) {
        const py = centerY - mathY * scale;
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      } else {
        started = false;
      }
    }
    ctx.stroke();

    // Active Traced Path
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const currentPx = centerX + xVal * scale;
    started = false;
    for (let px = 0; px <= currentPx; px += 2) {
      const mathX = (px - centerX) / scale;
      const mathY = evalFunc(mathX);
      if (mathY !== null && Math.abs(mathY) < 15) {
        const py = centerY - mathY * scale;
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      } else {
        started = false;
      }
    }
    ctx.stroke();

    // Active Point and Projections
    const mathY = evalFunc(xVal);
    if (mathY !== null && Math.abs(mathY) < 15) {
      const py = centerY - mathY * scale;

      // Dashed gold projections
      ctx.strokeStyle = '#d29922';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(currentPx, centerY);
      ctx.lineTo(currentPx, py);
      ctx.lineTo(centerX, py);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point dot
      ctx.fillStyle = '#d29922';
      ctx.beginPath();
      ctx.arc(currentPx, py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

  }, [xVal, funcMode]);

  const currentY = evalFunc(xVal);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Интерактив: Трассировщик</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Как рождается график на плоскости координат</h3>
        </div>

        <div className="flex flex-wrap gap-1 bg-[#0d1117] p-1 rounded-md border border-[#30363d] text-xs font-mono">
          {(['y=x', 'y=2x+1', 'y=x^2', 'y=10/x'] as FuncMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setFuncMode(mode)}
              className={`px-2.5 py-1 rounded transition-colors ${
                funcMode === mode ? 'bg-[#21262d] text-[#58a6ff] font-bold border border-[#30363d]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* Canvas strictly 480x320 */}
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto aspect-[3/2] block" />
          <div className="absolute top-2.5 left-2.5 bg-[#161b22]/90 backdrop-blur-md px-2.5 py-1 rounded border border-[#30363d] text-xs font-mono text-[#58a6ff]">
            {funcMode}
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Входной аргумент X:</span>
              <span className="text-[#58a6ff] font-bold">{xVal.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-4.0"
              max="4.0"
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
              <span className="text-sm font-bold text-[#3fb950]">{currentY === null ? 'Не определен' : currentY.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => setIsAutoPlaying(true)}
            disabled={isAutoPlaying}
            className="w-full py-2 rounded bg-[#21262d] hover:bg-[#30363d] disabled:opacity-50 text-[#c9d1d9] font-mono text-xs border border-[#30363d] flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current text-[#58a6ff]" />
            <span>Пройти все x автоматически</span>
          </button>
        </div>
      </div>
    </div>
  );
};
