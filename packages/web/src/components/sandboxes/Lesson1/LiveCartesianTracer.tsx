import React, { useState, useEffect, useRef } from 'react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const LiveCartesianTracer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [xVal, setXVal] = useState<number>(2);
  const [funcType, setFuncType] = useState<'linear' | 'quadratic' | 'cubic'>('quadratic');

  const evalFunc = (x: number): number => {
    switch (funcType) {
      case 'linear': return 1.5 * x;
      case 'quadratic': return 0.5 * x * x - 2;
      case 'cubic': return 0.1 * x * x * x;
      default: return x;
    }
  };

  const formulaStr = {
    linear: 'y = 1.5x',
    quadratic: 'y = 0.5x^2 - 2',
    cubic: 'y = 0.1x^3'
  }[funcType];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 26;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#21262d';
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
    ctx.strokeStyle = '#484f58';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    ctx.fillStyle = '#8b949e';
    ctx.font = '10px monospace';
    ctx.fillText('X', width - 15, centerY - 6);
    ctx.fillText('Y', centerX + 6, 14);

    // Ghost full curve
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const mathX = (px - centerX) / scale;
      const mathY = evalFunc(mathX);
      const py = centerY - mathY * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Traced path up to X
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const currentPx = centerX + xVal * scale;
    const startPx = centerX - 6 * scale;
    for (let px = startPx; px <= currentPx; px += 2) {
      const mathX = (px - centerX) / scale;
      const mathY = evalFunc(mathX);
      const py = centerY - mathY * scale;
      if (px === startPx) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Point
    const currentY = evalFunc(xVal);
    const pointPy = centerY - currentY * scale;

    ctx.strokeStyle = '#d29922';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(currentPx, centerY);
    ctx.lineTo(currentPx, pointPy);
    ctx.lineTo(centerX, pointPy);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#d29922';
    ctx.beginPath();
    ctx.arc(currentPx, pointPy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

  }, [xVal, funcType]);

  const currentY = evalFunc(xVal);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Эксперимент 2
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Трассировщик графика на плоскости</h3>
        </div>

        <div className="flex gap-1 bg-[#0d1117] p-1 rounded-md border border-[#30363d] text-xs font-mono">
          {(['linear', 'quadratic', 'cubic'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFuncType(type)}
              className={`px-2.5 py-1 rounded transition-colors ${
                funcType === type
                  ? 'bg-[#21262d] text-[#58a6ff] font-semibold border border-[#30363d]'
                  : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
            >
              {type === 'linear' ? 'Прямая' : type === 'quadratic' ? 'Парабола' : 'Кубическая'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* Canvas */}
        <div className="relative w-full max-w-[460px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas
            ref={canvasRef}
            width={460}
            height={280}
            className="w-full h-auto aspect-[4/3] block"
          />
          <div className="absolute top-2.5 left-2.5 bg-[#161b22]/90 backdrop-blur-md px-2 py-1 rounded border border-[#30363d] text-xs font-mono text-[#58a6ff]">
            <FormulaView latex={formulaStr} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Входной аргумент X:</span>
              <span className="text-[#58a6ff] font-semibold">{xVal.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={xVal}
              onChange={(e) => setXVal(parseFloat(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-center">
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
            <MathText text="Точка $(x, y)$ двигается по плоскости. Непрерывное перемещение $x$ оставляет за собой след графика!" />
          </div>
        </div>
      </div>
    </div>
  );
};
