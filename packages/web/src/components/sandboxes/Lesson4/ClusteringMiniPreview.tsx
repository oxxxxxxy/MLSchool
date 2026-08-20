import React, { useState, useEffect, useRef } from 'react';
import { Layers, RefreshCw } from 'lucide-react';
import { MathText } from '../../math/MathText';

interface Dot {
  x: number;
  y: number;
  cluster: number;
}

export const ClusteringMiniPreview: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGrouped, setIsGrouped] = useState<boolean>(true);

  const [dots, setDots] = useState<Dot[]>([
    // Cluster 1 (Left-top)
    { x: -2.2, y: 1.5, cluster: 1 }, { x: -1.8, y: 2.0, cluster: 1 }, { x: -2.5, y: 1.0, cluster: 1 }, { x: -1.5, y: 1.2, cluster: 1 },
    // Cluster 2 (Right-bottom)
    { x: 1.8, y: -1.2, cluster: 2 }, { x: 2.3, y: -1.8, cluster: 2 }, { x: 1.5, y: -2.2, cluster: 2 }, { x: 2.5, y: -0.8, cluster: 2 }
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 32;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, width, height);

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

    // Cluster boundaries
    if (isGrouped) {
      // Group 1
      ctx.fillStyle = 'rgba(88, 166, 255, 0.1)';
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(centerX - 2.0 * scale, centerY - 1.4 * scale, 1.6 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Group 2
      ctx.fillStyle = 'rgba(188, 140, 255, 0.1)';
      ctx.strokeStyle = '#bc8cff';
      ctx.beginPath();
      ctx.arc(centerX + 2.0 * scale, centerY + 1.4 * scale, 1.6 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Dots
    dots.forEach(d => {
      const px = centerX + d.x * scale;
      const py = centerY - d.y * scale;
      const color = !isGrouped ? '#8b949e' : d.cluster === 1 ? '#58a6ff' : '#bc8cff';

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

  }, [dots, isGrouped]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#bc8cff] uppercase">
            Интерактивный блок 3: Кластеризация
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Поиск скрытых групп без подсказок</h3>
        </div>

        <button
          onClick={() => setIsGrouped(!isGrouped)}
          className={`px-3 py-1 rounded text-xs font-mono transition-colors border ${
            isGrouped
              ? 'bg-[#238636] text-white border-[#2ea043]'
              : 'bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]'
          }`}
        >
          {isGrouped ? 'Группы найдены' : 'Найти группы'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[440px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={440} height={260} className="w-full h-auto aspect-[3/2] block" />
        </div>

        <div className="flex-1 w-full space-y-2.5 text-xs text-[#8b949e] leading-relaxed">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d]">
            <span className="text-[#f0f6fc] font-semibold block mb-1">Без учителя (Unsupervised):</span>
            Никаких меток нет. Компьютер просто видит, что точки слева кучкуются вместе, а точки справа — вместе, и автоматически делит их на 2 кластера.
          </div>
        </div>
      </div>
    </div>
  );
};
