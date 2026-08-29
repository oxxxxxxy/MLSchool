import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, Rotate3d, Layers } from 'lucide-react';
import { MathText } from '../../math/MathText';

export const Bowl3DGradient: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotX, setRotX] = useState<number>(35); // degrees
  const [rotY, setRotY] = useState<number>(45); // degrees
  const [ballX, setBallX] = useState<number>(1.2);
  const [ballY, setBallY] = useState<number>(0.9);
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Bowl function: L(w1, w2) = w1^2 + w2^2
  // Gradient: ∇L = (2*w1, 2*w2) -> direction of steepest ascent
  // -∇L = (-2*w1, -2*w2) -> direction of steepest descent (Learning)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const radX = (rotX * Math.PI) / 180;
    const radY = (rotY * Math.PI) / 180;

    const project = (x: number, y: number, z: number) => {
      // Rotate around Y axis
      const x1 = x * Math.cos(radY) + z * Math.sin(radY);
      const y1 = y;
      const z1 = -x * Math.sin(radY) + z * Math.cos(radY);

      // Rotate around X axis
      const x2 = x1;
      const y2 = y1 * Math.cos(radX) - z1 * Math.sin(radX);
      const z2 = y1 * Math.sin(radX) + z1 * Math.cos(radX);

      const scale = 40;
      const px = width / 2 + x2 * scale;
      const py = height / 2 - y2 * scale;
      return { px, py, z: z2 };
    };

    // Draw 3D wireframe bowl: z_func = 0.3 * (x^2 + y^2)
    const gridSize = 14;
    const step = 0.3;

    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;

    for (let i = -gridSize / 2; i <= gridSize / 2; i++) {
      ctx.beginPath();
      for (let j = -gridSize / 2; j <= gridSize / 2; j++) {
        const gx = i * step;
        const gy = j * step;
        const gz = 0.3 * (gx * gx + gy * gy) - 1.5;
        const p = project(gx, gz, gy);
        if (j === -gridSize / 2) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.stroke();
    }

    for (let j = -gridSize / 2; j <= gridSize / 2; j++) {
      ctx.beginPath();
      for (let i = -gridSize / 2; i <= gridSize / 2; i++) {
        const gx = i * step;
        const gy = j * step;
        const gz = 0.3 * (gx * gx + gy * gy) - 1.5;
        const p = project(gx, gz, gy);
        if (i === -gridSize / 2) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.stroke();
    }

    // Ball on surface
    const bz = 0.3 * (ballX * ballX + ballY * ballY) - 1.5;
    const ballProj = project(ballX, bz, ballY);

    // Gradient vector ∇L (Upward Ascent, Red)
    const gradScale = 0.4;
    const gradX = 2 * ballX * gradScale;
    const gradY = 2 * ballY * gradScale;
    const gradZ = 0.3 * ((ballX + gradX) ** 2 + (ballY + gradY) ** 2) - 1.5;
    const gradProj = project(ballX + gradX, gradZ, ballY + gradY);

    // Negative Gradient -∇L (Downward Descent, Green)
    const descX = -2 * ballX * gradScale;
    const descY = -2 * ballY * gradScale;
    const descZ = 0.3 * ((ballX + descX) ** 2 + (ballY + descY) ** 2) - 1.5;
    const descProj = project(ballX + descX, descZ, ballY + descY);

    // Draw Red Arrow ∇L (Ascent)
    ctx.strokeStyle = '#f85149';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(ballProj.px, ballProj.py);
    ctx.lineTo(gradProj.px, gradProj.py);
    ctx.stroke();

    ctx.fillStyle = '#f85149';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('∇L (Рост ошибки)', gradProj.px + 4, gradProj.py - 4);

    // Draw Green Arrow -∇L (Descent)
    ctx.strokeStyle = '#3fb950';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(ballProj.px, ballProj.py);
    ctx.lineTo(descProj.px, descProj.py);
    ctx.stroke();

    ctx.fillStyle = '#3fb950';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('-∇L (Обучение / Спуск)', descProj.px + 4, descProj.py + 12);

    // Ball Core
    ctx.fillStyle = '#58a6ff';
    ctx.beginPath();
    ctx.arc(ballProj.px, ballProj.py, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

  }, [rotX, rotY, ballX, ballY]);

  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    lastPos.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - lastPos.current.x;
    const dy = clientY - lastPos.current.y;
    setRotY(prev => (prev + dx * 0.6) % 360);
    setRotX(prev => Math.max(5, Math.min(85, prev + dy * 0.6)));
    lastPos.current = { x: clientX, y: clientY };
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Интерактив: Чаша и Градиент</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Градиент ∇L (подъем) vs Антиградиент -∇L (спуск)</h3>
        </div>
        <div className="flex gap-1 bg-[#0d1117] p-1 rounded-md border border-[#30363d] text-xs font-mono">
          <button onClick={() => { setRotX(75); setRotY(0); }} className="px-2 py-0.5 rounded text-[#8b949e] hover:text-[#c9d1d9]">Сверху</button>
          <button onClick={() => { setRotX(35); setRotY(45); }} className="px-2 py-0.5 rounded text-[#58a6ff] font-bold">3D</button>
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
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={e => e.touches.length === 1 && handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={e => e.touches.length === 1 && handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={() => setIsDragging(false)}
            className="w-full h-auto aspect-[3/2] block"
          />
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-[#8b949e] bg-[#161b22]/90 px-2 py-0.5 rounded border border-[#30363d]">
            🔄 Вращай 3D чашу мышкой или пальцем
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Положение шара (Параметр 1):</span>
              <span className="text-[#58a6ff] font-bold">{ballX.toFixed(1)}</span>
            </div>
            <input type="range" min="-1.8" max="1.8" step="0.1" value={ballX} onChange={e => setBallX(parseFloat(e.target.value))} className="w-full accent-[#58a6ff] cursor-pointer" />

            <div className="flex justify-between text-xs font-mono pt-1">
              <span className="text-[#8b949e]">Положение шара (Параметр 2):</span>
              <span className="text-[#d29922] font-bold">{ballY.toFixed(1)}</span>
            </div>
            <input type="range" min="-1.8" max="1.8" step="0.1" value={ballY} onChange={e => setBallY(parseFloat(e.target.value))} className="w-full accent-[#d29922] cursor-pointer" />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] text-xs space-y-1.5 leading-relaxed">
            <div className="text-[#f85149] font-mono font-bold">• ∇L (Красная стрелка): показывает подъем в гору (рост ошибки).</div>
            <div className="text-[#3fb950] font-mono font-bold">• -∇L (Зеленая стрелка): спуск на самое дно (обучение модели).</div>
          </div>
        </div>
      </div>
    </div>
  );
};
