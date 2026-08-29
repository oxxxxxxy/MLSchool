import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Sparkles } from 'lucide-react';
import { MathText } from '../../math/MathText';

interface DataPoint {
  x: number;
  y: number;
}

const DATASET: DataPoint[] = [
  { x: 1, y: 3 },
  { x: 2, y: 5 },
  { x: 3, y: 7 },
  { x: 4, y: 9 },
  { x: 5, y: 11 }
];

export const RealtimeTrainingStudio: React.FC = () => {
  const dataCanvasRef = useRef<HTMLCanvasElement>(null);
  const lossCanvasRef = useRef<HTMLCanvasElement>(null);

  const [k, setK] = useState<number>(0.0);
  const [b, setB] = useState<number>(0.0);
  const [epoch, setEpoch] = useState<number>(0);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const lr = 0.02;

  // Compute MSE and gradients
  const n = DATASET.length;
  let mse = 0;
  let dk = 0;
  let db = 0;

  DATASET.forEach(p => {
    const yHat = k * p.x + b;
    const e = yHat - p.y;
    mse += e * e;
    dk += 2 * e * p.x;
    db += 2 * e;
  });

  mse /= n;
  dk /= n;
  db /= n;

  const performEpochs = (count: number) => {
    let curK = k;
    let curB = b;
    let curEpoch = epoch;
    const newLosses = [...lossHistory];

    for (let step = 0; step < count; step++) {
      let stepMse = 0;
      let stepDk = 0;
      let stepDb = 0;

      DATASET.forEach(p => {
        const yHat = curK * p.x + curB;
        const e = yHat - p.y;
        stepMse += e * e;
        stepDk += 2 * e * p.x;
        stepDb += 2 * e;
      });

      stepMse /= n;
      stepDk /= n;
      stepDb /= n;

      curK -= lr * stepDk;
      curB -= lr * stepDb;
      curEpoch += 1;
      newLosses.push(stepMse);
    }

    setK(curK);
    setB(curB);
    setEpoch(curEpoch);
    setLossHistory(newLosses);
  };

  const handleReset = () => {
    setK(0.0);
    setB(0.0);
    setEpoch(0);
    setLossHistory([]);
    setIsPlaying(false);
  };

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        performEpochs(1);
      }, 80);
    }
    return () => clearInterval(timer);
  }, [isPlaying, k, b, epoch, lossHistory]);

  // Draw Data Canvas (Left)
  useEffect(() => {
    const canvas = dataCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scaleX = 40;
    const scaleY = 18;
    const originX = 40;
    const originY = height - 30;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#21262d';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 6; x++) {
      const px = originX + x * scaleX;
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, originY); ctx.stroke();
    }
    for (let y = 0; y <= 12; y += 2) {
      const py = originY - y * scaleY;
      ctx.beginPath(); ctx.moveTo(originX, py); ctx.lineTo(width, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#484f58';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(originX, originY); ctx.lineTo(width, originY);
    ctx.moveTo(originX, 0); ctx.lineTo(originX, originY);
    ctx.stroke();

    // Model line ŷ = kx + b
    ctx.strokeStyle = mse < 0.1 ? '#3fb950' : '#58a6ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(originX, originY - b * scaleY);
    ctx.lineTo(originX + 6 * scaleX, originY - (k * 6 + b) * scaleY);
    ctx.stroke();

    // Data points
    DATASET.forEach(p => {
      const px = originX + p.x * scaleX;
      const py = originY - p.y * scaleY;
      ctx.fillStyle = '#f0f6fc';
      ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#58a6ff'; ctx.lineWidth = 2; ctx.stroke();
    });

  }, [k, b, mse]);

  // Draw Loss History Canvas (Right)
  useEffect(() => {
    const canvas = lossCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Axes
    ctx.strokeStyle = '#484f58';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(35, height - 25); ctx.lineTo(width - 10, height - 25);
    ctx.moveTo(35, 10); ctx.lineTo(35, height - 25);
    ctx.stroke();

    ctx.fillStyle = '#8b949e';
    ctx.font = '9px monospace';
    ctx.fillText('Epoch', width - 35, height - 10);
    ctx.fillText('MSE', 6, 20);

    if (lossHistory.length > 1) {
      const maxEpoch = Math.max(50, lossHistory.length);
      const maxLoss = 60;

      ctx.strokeStyle = '#f85149';
      ctx.lineWidth = 2;
      ctx.beginPath();

      lossHistory.forEach((l, idx) => {
        const px = 35 + (idx / maxEpoch) * (width - 50);
        const py = (height - 25) - Math.min(1, l / maxLoss) * (height - 40);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

  }, [lossHistory]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase">Студия обучения в реальном времени</span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Эпоха {epoch}: Градиентный спуск подбирает параметры k и b</h3>
        </div>
        <div className="flex gap-1">
          <button onClick={handleReset} className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d]" title="Сбросить">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Telemetry Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
        <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
          <span className="text-[10px] text-[#8b949e] block">Эпоха (Epoch)</span>
          <span className="text-sm font-bold text-[#58a6ff]">{epoch}</span>
        </div>
        <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
          <span className="text-[10px] text-[#8b949e] block">Наклон k</span>
          <span className="text-sm font-bold text-[#d29922]">{k.toFixed(2)}</span>
        </div>
        <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
          <span className="text-[10px] text-[#8b949e] block">Сдвиг b</span>
          <span className="text-sm font-bold text-[#d29922]">{b.toFixed(2)}</span>
        </div>
        <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
          <span className="text-[10px] text-[#8b949e] block">Ошибка MSE</span>
          <span className={`text-sm font-bold ${mse < 0.2 ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>{mse.toFixed(2)}</span>
        </div>
      </div>

      {/* Double Screen: Data vs Loss curve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono text-[#58a6ff] font-bold block">1. Данные и Линия: ŷ = {k.toFixed(2)}x + {b.toFixed(2)}</span>
          <div className="relative rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117]">
            <canvas ref={dataCanvasRef} width={360} height={220} className="w-full h-auto aspect-[3/2] block" />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono text-[#f85149] font-bold block">2. График падения ошибки (Loss History)</span>
          <div className="relative rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117]">
            <canvas ref={lossCanvasRef} width={360} height={220} className="w-full h-auto aspect-[3/2] block" />
          </div>
        </div>
      </div>

      {/* Training Controls */}
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          onClick={() => performEpochs(1)}
          className="flex-1 py-2 px-3 rounded bg-[#21262d] hover:bg-[#30363d] text-xs font-mono text-[#c9d1d9] border border-[#30363d] transition-colors"
        >
          +1 Эпоха
        </button>
        <button
          onClick={() => performEpochs(10)}
          className="flex-1 py-2 px-3 rounded bg-[#21262d] hover:bg-[#30363d] text-xs font-mono text-[#58a6ff] border border-[#30363d] transition-colors"
        >
          +10 Эпох
        </button>
        <button
          onClick={() => performEpochs(100)}
          className="flex-1 py-2 px-3 rounded bg-[#21262d] hover:bg-[#30363d] text-xs font-mono text-[#d29922] border border-[#30363d] transition-colors"
        >
          +100 Эпох
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex-1 py-2 px-4 rounded text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5 ${
            isPlaying ? 'bg-[#da3633] text-white' : 'bg-[#238636] hover:bg-[#2ea043] text-white'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isPlaying ? 'Пауза' : 'Авто-обучение'}</span>
        </button>
      </div>
    </div>
  );
};
