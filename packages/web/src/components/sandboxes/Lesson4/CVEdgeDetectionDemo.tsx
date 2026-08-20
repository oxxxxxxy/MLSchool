import React, { useState, useEffect, useRef } from 'react';
import { Eye, Scan, Zap } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';
import { MathText } from '../../math/MathText';

export const CVEdgeDetectionDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [threshold, setThreshold] = useState<number>(35);
  const [mode, setMode] = useState<'both' | 'original' | 'edges'>('both');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Create an offscreen buffer with shapes (a robot head, circle eyes, triangular nose)
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 240;
    offCanvas.height = 160;
    const offCtx = offCanvas.getContext('2d')!;

    // Draw dark background
    offCtx.fillStyle = '#161b22';
    offCtx.fillRect(0, 0, 240, 160);

    // Robot face body (Bright box)
    offCtx.fillStyle = '#8b949e';
    offCtx.fillRect(40, 30, 160, 100);

    // Dark eyes
    offCtx.fillStyle = '#0d1117';
    offCtx.beginPath();
    offCtx.arc(80, 65, 18, 0, Math.PI * 2);
    offCtx.arc(160, 65, 18, 0, Math.PI * 2);
    offCtx.fill();

    // Glowing pupils
    offCtx.fillStyle = '#58a6ff';
    offCtx.beginPath();
    offCtx.arc(80, 65, 8, 0, Math.PI * 2);
    offCtx.arc(160, 65, 8, 0, Math.PI * 2);
    offCtx.fill();

    // Antenna
    offCtx.fillStyle = '#d29922';
    offCtx.fillRect(115, 10, 10, 20);
    offCtx.beginPath();
    offCtx.arc(120, 10, 8, 0, Math.PI * 2);
    offCtx.fill();

    // Mouth
    offCtx.fillStyle = '#f85149';
    offCtx.fillRect(75, 105, 90, 12);

    // Get image pixels
    const imgData = offCtx.getImageData(0, 0, 240, 160);
    const pixels = imgData.data;

    // Convert to grayscale grid
    const gray: number[][] = [];
    for (let y = 0; y < 160; y++) {
      gray[y] = [];
      for (let x = 0; x < 240; x++) {
        const idx = (y * 240 + x) * 4;
        gray[y][x] = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
      }
    }

    // Compute derivative / Sobel Gradient: Gx = right - left, Gy = bottom - top
    const edgeImgData = ctx.createImageData(240, 160);
    for (let y = 1; y < 159; y++) {
      for (let x = 1; x < 239; x++) {
        const gx = gray[y][x + 1] - gray[y][x - 1]; // Horizontal derivative dI/dx
        const gy = gray[y + 1][x] - gray[y - 1][x]; // Vertical derivative dI/dy
        const gradMag = Math.sqrt(gx * gx + gy * gy);

        const isEdge = gradMag > threshold;
        const outIdx = (y * 240 + x) * 4;

        if (isEdge) {
          edgeImgData.data[outIdx] = 56; // Cyan edge: #38bdf8
          edgeImgData.data[outIdx + 1] = 189;
          edgeImgData.data[outIdx + 2] = 248;
          edgeImgData.data[outIdx + 3] = 255;
        } else {
          edgeImgData.data[outIdx] = 13;
          edgeImgData.data[outIdx + 1] = 17;
          edgeImgData.data[outIdx + 2] = 23;
          edgeImgData.data[outIdx + 3] = 255;
        }
      }
    }

    // Render based on mode
    if (mode === 'original') {
      ctx.drawImage(offCanvas, 0, 0, width, height);
    } else if (mode === 'edges') {
      // Put edge data onto temporary canvas to scale
      const edgeCanvas = document.createElement('canvas');
      edgeCanvas.width = 240;
      edgeCanvas.height = 160;
      edgeCanvas.getContext('2d')!.putImageData(edgeImgData, 0, 0);
      ctx.drawImage(edgeCanvas, 0, 0, width, height);
    } else {
      // Split view: Left original, Right edges
      const edgeCanvas = document.createElement('canvas');
      edgeCanvas.width = 240;
      edgeCanvas.height = 160;
      edgeCanvas.getContext('2d')!.putImageData(edgeImgData, 0, 0);

      ctx.drawImage(offCanvas, 0, 0, 120, 160, 0, 0, width / 2, height);
      ctx.drawImage(edgeCanvas, 120, 0, 120, 160, width / 2, 0, width / 2, height);

      // Split line
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      ctx.fillStyle = '#8b949e';
      ctx.font = '10px monospace';
      ctx.fillText('Оригинал (Человек)', 15, 20);
      ctx.fillText('Градиенты CV (Робот)', width / 2 + 15, 20);
    }

  }, [threshold, mode]);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#58a6ff] uppercase flex items-center gap-1.5">
            <Scan className="w-3.5 h-3.5" />
            Компьютерное зрение (Computer Vision)
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Детектор контуров: Производная яркости пикселей</h3>
        </div>

        <div className="flex gap-1 bg-[#0d1117] p-1 rounded-md border border-[#30363d] text-xs font-mono">
          <button
            onClick={() => setMode('both')}
            className={`px-2.5 py-1 rounded transition-colors ${
              mode === 'both' ? 'bg-[#21262d] text-[#58a6ff] font-semibold border border-[#30363d]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            Сравнение
          </button>
          <button
            onClick={() => setMode('original')}
            className={`px-2.5 py-1 rounded transition-colors ${
              mode === 'original' ? 'bg-[#21262d] text-[#58a6ff] font-semibold border border-[#30363d]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            Оригинал
          </button>
          <button
            onClick={() => setMode('edges')}
            className={`px-2.5 py-1 rounded transition-colors ${
              mode === 'edges' ? 'bg-[#21262d] text-[#58a6ff] font-semibold border border-[#30363d]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            Контуры CV
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* Canvas */}
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0">
          <canvas ref={canvasRef} width={480} height={320} className="w-full h-auto aspect-[3/2] block" />
        </div>

        {/* Controls */}
        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Порог градиента (Чуткость к перепадам):</span>
              <span className="text-[#58a6ff] font-semibold">{threshold}</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="2"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] text-xs text-[#8b949e] space-y-2 leading-relaxed">
            <div className="font-mono text-[#f0f6fc] text-xs">
              <FormulaView latex="\text{Градиент} = \sqrt{\left(\frac{\Delta \text{Яркость}}{\Delta x}\right)^2 + \left(\frac{\Delta \text{Яркость}}{\Delta y}\right)^2}" />
            </div>
            <MathText text="Когда цвет резко меняется (перепад яркости), производная подскакивает. Автопилот Теслы мгновенно видит границы пешеходов и дорожных знаков!" />
          </div>
        </div>
      </div>
    </div>
  );
};
