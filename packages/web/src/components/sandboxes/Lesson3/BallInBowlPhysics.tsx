import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

export const BallInBowlPhysics: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ballX, setBallX] = useState<number>(-4.0);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  const ballPosRef = useRef<number>(-4.0);
  const ballVelRef = useRef<number>(0.0);

  const resetBall = (start: number) => {
    ballPosRef.current = start;
    ballVelRef.current = 0;
    setBallX(start);
    setIsRunning(true);
  };

  useEffect(() => {
    let animId: number;

    const animate = () => {
      if (isRunning) {
        // Physics: Parabola y = 0.2 * x^2 => Slope f'(x) = 0.4 * x
        // Force towards center = -0.4 * x
        const gravityFactor = 0.05;
        const friction = 0.96;

        const force = -0.4 * ballPosRef.current * gravityFactor;
        ballVelRef.current = (ballVelRef.current + force) * friction;
        ballPosRef.current += ballVelRef.current;

        setBallX(ballPosRef.current);
      }

      // Draw
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;
          const scale = 28;
          const centerX = width / 2;
          const centerY = height / 2 + 50;

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

          // Bowl Surface y = 0.15 * x^2
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 4;
          ctx.shadowColor = '#059669';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          for (let px = 0; px <= width; px += 2) {
            const mx = (px - centerX) / scale;
            const my = 0.18 * mx * mx;
            const py = centerY - my * scale;
            if (px === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Target Minimum Mark at (0, 0)
          ctx.fillStyle = 'rgba(234, 179, 8, 0.3)';
          ctx.beginPath();
          ctx.arc(centerX, centerY, 16, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('Минимум Ошибки (Loss = 0)', centerX - 70, centerY + 28);

          // Ball
          const currentMx = ballPosRef.current;
          const currentMy = 0.18 * currentMx * currentMx;
          const ballPx = centerX + currentMx * scale;
          const ballPy = centerY - currentMy * scale - 10;

          // Ball shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.beginPath();
          ctx.ellipse(ballPx, centerY - currentMy * scale, 8, 3, 0, 0, Math.PI * 2);
          ctx.fill();

          // Ball Body
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(ballPx, ballPy, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isRunning]);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            Интерактивный эксперимент 3
          </span>
          <h3 className="text-lg font-bold text-white">Физика Шарика на Дне Чаши Потерь (Loss Bowl)</h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => resetBall(-4.5)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Бросить слева (-4.5)
          </button>
          <button
            onClick={() => resetBall(4.5)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Бросить справа (+4.5)
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-inner">
          <canvas ref={canvasRef} width={480} height={260} className="w-full max-w-[480px] h-[260px] block" />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-xs text-slate-400 block font-semibold">Позиция шарика на графике:</span>
            <div className="text-xl font-black font-mono text-rose-400">
              x = {ballX.toFixed(2)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 text-xs text-teal-200 leading-relaxed space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Аналогия с обучением ИИ:</span>
            </div>
            <p>
              Гравитация тянет шарик прямо в центр чаши, где ошибка равна нулю. В следующем уроке мы узнаем, что силой этой гравитации управляет <strong>ПРОИЗВОДНАЯ</strong>!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
