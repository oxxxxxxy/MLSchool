import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { MathText } from '../../math/MathText';

interface Star {
  x: number;
  y: number;
  cluster: number; // 0, 1, 2, 3
}

const CLUSTER_COLORS = ['#58a6ff', '#3fb950', '#d29922', '#bc8cff'];

export const StarClusterExplorer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [numClusters, setNumClusters] = useState<number>(3); // K = 2, 3, 4
  const [isClustered, setIsClustered] = useState<boolean>(true);

  // Generate synthetic stars around K centers
  const generateStars = (): Star[] => {
    const centers = [
      { x: -2.2, y: 1.8 },
      { x: 2.0, y: 1.5 },
      { x: -0.2, y: -2.0 },
      { x: 2.2, y: -1.8 }
    ];

    const stars: Star[] = [];
    for (let c = 0; c < 4; c++) {
      for (let i = 0; i < 9; i++) {
        stars.push({
          x: centers[c].x + (Math.random() - 0.5) * 1.5,
          y: centers[c].y + (Math.random() - 0.5) * 1.5,
          cluster: c
        });
      }
    }
    return stars;
  };

  const [stars, setStars] = useState<Star[]>(generateStars);

  const handleRegenerate = () => {
    setStars(generateStars());
  };

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

    // Deep space background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, width, height);

    // Faint grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
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

    // Draw connecting lines between stars in the same cluster if clustered
    if (isClustered) {
      for (let c = 0; c < numClusters; c++) {
        const clusterStars = stars.filter(s => s.cluster % numClusters === c);
        ctx.strokeStyle = `${CLUSTER_COLORS[c]}33`;
        ctx.lineWidth = 1;
        for (let i = 0; i < clusterStars.length; i++) {
          for (let j = i + 1; j < clusterStars.length; j++) {
            const dist = Math.hypot(clusterStars[i].x - clusterStars[j].x, clusterStars[i].y - clusterStars[j].y);
            if (dist < 1.4) {
              const p1 = { px: centerX + clusterStars[i].x * scale, py: centerY - clusterStars[i].y * scale };
              const p2 = { px: centerX + clusterStars[j].x * scale, py: centerY - clusterStars[j].y * scale };
              ctx.beginPath();
              ctx.moveTo(p1.px, p1.py);
              ctx.lineTo(p2.px, p2.py);
              ctx.stroke();
            }
          }
        }
      }
    }

    // Draw Stars
    stars.forEach(s => {
      const px = centerX + s.x * scale;
      const py = centerY - s.y * scale;
      const assignedCluster = s.cluster % numClusters;
      const color = isClustered ? CLUSTER_COLORS[assignedCluster] : '#f0f6fc';

      // Star Glow
      ctx.fillStyle = `${color}44`;
      ctx.beginPath();
      ctx.arc(px, py, isClustered ? 8 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Star Core
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    });

  }, [stars, numClusters, isClustered]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Эксперимент 1
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Космический картограф: Поиск созвездий</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Cluster count selector */}
          <div className="flex gap-1 bg-[#0d1117] p-1 rounded-md border border-[#30363d] text-xs font-mono">
            {[2, 3, 4].map(k => (
              <button
                key={k}
                onClick={() => setNumClusters(k)}
                className={`px-2.5 py-0.5 rounded transition-colors ${
                  numClusters === k
                    ? 'bg-[#21262d] text-[#58a6ff] font-semibold border border-[#30363d]'
                    : 'text-[#8b949e] hover:text-[#c9d1d9]'
                }`}
              >
                K = {k}
              </button>
            ))}
          </div>

          <button
            onClick={handleRegenerate}
            className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d]"
            title="Перегенерировать звезды"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto aspect-[3/2] block" />
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-[#8b949e] bg-[#161b22]/90 px-2 py-0.5 rounded border border-[#30363d]">
            Найдено {numClusters} скопления звезд
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setIsClustered(!isClustered)}
              className={`w-full py-2 rounded text-xs font-mono font-medium transition-colors border ${
                isClustered
                  ? 'bg-[#238636] text-white border-[#2ea043]'
                  : 'bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]'
              }`}
            >
              {isClustered ? '✨ Кластеры найдены' : 'Сгруппировать звезды'}
            </button>
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] text-xs text-[#8b949e] leading-relaxed space-y-1.5">
            <span className="font-semibold text-[#f0f6fc] block">Принцип близости:</span>
            <MathText text="Компьютер измеряет расстояния между всеми звездами. Точки, которые лежат рядом в пространстве, объединяются в один цветной кластер без каких-либо подсказок человека!" />
          </div>
        </div>
      </div>
    </div>
  );
};
