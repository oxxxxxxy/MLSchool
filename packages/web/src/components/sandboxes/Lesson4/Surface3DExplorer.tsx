import React, { useState, useEffect, useRef } from 'react';
import { Eye, RotateCcw } from 'lucide-react';
import { MathText } from '../../math/MathText';

type SurfaceType = 'bowl' | 'saddle' | 'double_well';

export const Surface3DExplorer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [surfaceType, setSurfaceType] = useState<SurfaceType>('bowl');
  const [probeX, setProbeX] = useState<number>(1.5);
  const [probeY, setProbeY] = useState<number>(1.2);
  const [yaw, setYaw] = useState<number>(45); // horizontal rotation in deg
  const [pitch, setPitch] = useState<number>(55); // vertical elevation: 0 = side, 90 = top down
  const [zoom, setZoom] = useState<number>(30);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const evalZ = (x: number, y: number, type: SurfaceType): number => {
    switch (type) {
      case 'bowl':
        return 0.22 * (x * x + y * y);
      case 'saddle':
        return 0.18 * (x * x - y * y);
      case 'double_well':
        return 0.08 * (Math.pow(x, 4) - 5 * x * x + 3 * y * y) + 1.2;
      default:
        return 0.22 * (x * x + y * y);
    }
  };

  const evalGrad = (x: number, y: number, type: SurfaceType): { gx: number; gy: number } => {
    const eps = 0.001;
    const z = evalZ(x, y, type);
    const gx = (evalZ(x + eps, y, type) - z) / eps;
    const gy = (evalZ(x, y + eps, type) - z) / eps;
    return { gx, gy };
  };

  const currentZ = evalZ(probeX, probeY, surfaceType);
  const { gx, gy } = evalGrad(probeX, probeY, surfaceType);
  const gradMag = Math.sqrt(gx * gx + gy * gy);

  const getZColor = (z: number, minZ: number, maxZ: number): string => {
    const t = Math.max(0, Math.min(1, (z - minZ) / (maxZ - minZ || 1)));
    if (t < 0.3) {
      return '#38bdf8'; // Sky blue in valleys
    } else if (t < 0.6) {
      return '#34d399'; // Emerald
    } else if (t < 0.85) {
      return '#fbbf24'; // Amber
    } else {
      return '#f87171'; // Coral on peaks
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Camera angles
    const radYaw = (yaw * Math.PI) / 180;
    const radPitch = (pitch * Math.PI) / 180;
    const cosY = Math.cos(radYaw);
    const sinY = Math.sin(radYaw);
    const cosP = Math.cos(radPitch);
    const sinP = Math.sin(radPitch);

    // True 3D camera transformation:
    // (x, y) rotate around Z by yaw -> (x1, y1)
    // elevation by pitch (0 = side, 90 = looking straight down from top)
    const project3D = (x: number, y: number, z: number) => {
      const x1 = x * cosY - y * sinY;
      const y1 = x * sinY + y * cosY;

      // Screen coordinates:
      // Horizontal: x1
      // Vertical: y1 rotated by pitch + z projected by pitch
      const screenX = width / 2 + x1 * zoom;
      const screenY = height / 2 + 30 - (y1 * sinP + z * cosP) * zoom;
      const depth = y1 * cosP - z * sinP;
      return { px: screenX, py: screenY, depth };
    };

    const range = 3.0;
    const step = 0.35;
    let minZ = 999, maxZ = -999;
    for (let x = -range; x <= range; x += step) {
      for (let y = -range; y <= range; y += step) {
        const z = evalZ(x, y, surfaceType);
        if (z < minZ) minZ = z;
        if (z > maxZ) maxZ = z;
      }
    }

    // Draw Grid Lines along X
    for (let y = -range; y <= range; y += step) {
      ctx.beginPath();
      let first = true;
      for (let x = -range; x <= range; x += 0.12) {
        const z = evalZ(x, y, surfaceType);
        const { px, py } = project3D(x, y, z);
        if (first) { ctx.moveTo(px, py); first = false; }
        else { ctx.lineTo(px, py); }
      }
      const avgZ = evalZ(0, y, surfaceType);
      ctx.strokeStyle = getZColor(avgZ, minZ, maxZ);
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.55;
      ctx.stroke();
    }

    // Draw Grid Lines along Y
    for (let x = -range; x <= range; x += step) {
      ctx.beginPath();
      let first = true;
      for (let y = -range; y <= range; y += 0.12) {
        const z = evalZ(x, y, surfaceType);
        const { px, py } = project3D(x, y, z);
        if (first) { ctx.moveTo(px, py); first = false; }
        else { ctx.lineTo(px, py); }
      }
      const avgZ = evalZ(x, 0, surfaceType);
      ctx.strokeStyle = getZColor(avgZ, minZ, maxZ);
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.55;
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Minimum marker at center (if bowl)
    if (surfaceType === 'bowl') {
      const minP = project3D(0, 0, 0);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(minP.px, minP.py, 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Probe Point
    const probePoint = project3D(probeX, probeY, currentZ);

    // Downhill Gradient Vector Arrow
    const norm = gradMag > 0.01 ? gradMag : 1;
    const arrowLen = 1.1;
    const arrowTargetX = probeX - (gx / norm) * arrowLen;
    const arrowTargetY = probeY - (gy / norm) * arrowLen;
    const arrowTargetZ = evalZ(arrowTargetX, arrowTargetY, surfaceType);
    const arrowHead = project3D(arrowTargetX, arrowTargetY, arrowTargetZ);

    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(probePoint.px, probePoint.py);
    ctx.lineTo(arrowHead.px, arrowHead.py);
    ctx.stroke();

    const headAngle = Math.atan2(arrowHead.py - probePoint.py, arrowHead.px - probePoint.px);
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.moveTo(arrowHead.px, arrowHead.py);
    ctx.lineTo(arrowHead.px - 9 * Math.cos(headAngle - Math.PI / 6), arrowHead.py - 9 * Math.sin(headAngle - Math.PI / 6));
    ctx.lineTo(arrowHead.px - 9 * Math.cos(headAngle + Math.PI / 6), arrowHead.py - 9 * Math.sin(headAngle + Math.PI / 6));
    ctx.fill();

    // Probe Spherical Dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(probePoint.px, probePoint.py, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

  }, [probeX, probeY, yaw, pitch, zoom, surfaceType, currentZ, gx, gy, gradMag]);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };

    setYaw(prev => (prev + dx * 0.6) % 360);
    // Moving mouse up tilts camera up (larger pitch = looking down from above)
    setPitch(prev => Math.max(-10, Math.min(88, prev - dy * 0.5)));
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastPos.current.x;
    const dy = e.touches[0].clientY - lastPos.current.y;
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setYaw(prev => (prev + dx * 0.6) % 360);
    setPitch(prev => Math.max(-10, Math.min(88, prev - dy * 0.5)));
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setZoom(prev => Math.max(15, Math.min(50, prev - e.deltaY * 0.03)));
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      {/* Header with presets */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Интерактивный 3D График
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">3D Ландшафт и Направление Градиента</h3>
        </div>

        {/* View presets */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setPitch(75); setYaw(45); }}
            className={`px-2 py-1 rounded text-xs font-mono transition-colors border ${
              pitch > 65
                ? 'bg-[#21262d] border-[#8b949e] text-[#f0f6fc]'
                : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            Сверху (75°)
          </button>
          <button
            onClick={() => { setPitch(35); setYaw(45); }}
            className={`px-2 py-1 rounded text-xs font-mono transition-colors border ${
              pitch <= 65 && pitch >= 20
                ? 'bg-[#21262d] border-[#8b949e] text-[#f0f6fc]'
                : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            3D (35°)
          </button>
          <button
            onClick={() => { setPitch(5); setYaw(0); }}
            className={`px-2 py-1 rounded text-xs font-mono transition-colors border ${
              pitch < 20
                ? 'bg-[#21262d] border-[#8b949e] text-[#f0f6fc]'
                : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            Сбоку (5°)
          </button>
        </div>
      </div>

      {/* Surface switcher tabs */}
      <div className="flex gap-1 border-b border-[#30363d] pb-2 text-xs">
        <button
          onClick={() => setSurfaceType('bowl')}
          className={`px-3 py-1 rounded font-mono transition-colors ${
            surfaceType === 'bowl'
              ? 'bg-[#21262d] text-[#58a6ff] font-semibold border border-[#30363d]'
              : 'text-[#8b949e] hover:text-[#c9d1d9]'
          }`}
        >
          Чаша: z = 0.22(x² + y²)
        </button>
        <button
          onClick={() => setSurfaceType('double_well')}
          className={`px-3 py-1 rounded font-mono transition-colors ${
            surfaceType === 'double_well'
              ? 'bg-[#21262d] text-[#58a6ff] font-semibold border border-[#30363d]'
              : 'text-[#8b949e] hover:text-[#c9d1d9]'
          }`}
        >
          Две впадины
        </button>
        <button
          onClick={() => setSurfaceType('saddle')}
          className={`px-3 py-1 rounded font-mono transition-colors ${
            surfaceType === 'saddle'
              ? 'bg-[#21262d] text-[#58a6ff] font-semibold border border-[#30363d]'
              : 'text-[#8b949e] hover:text-[#c9d1d9]'
          }`}
        >
          Седловина: z = 0.18(x² - y²)
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* Canvas */}
        <div className="relative w-full max-w-[480px] rounded-lg overflow-hidden border border-[#30363d] bg-[#0d1117] flex-shrink-0 cursor-grab active:cursor-grabbing touch-none">
          <canvas
            ref={canvasRef}
            width={480}
            height={320}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setIsDragging(false)}
            onWheel={handleWheel}
            className="w-full h-auto aspect-[4/3] block"
          />

          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-[#8b949e] bg-[#161b22]/90 px-2 py-0.5 rounded border border-[#30363d]">
            Угол: {pitch.toFixed(0)}° (Тяни вверх для вида сверху)
          </div>

          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-[#f87171] bg-[#161b22]/90 px-2 py-0.5 rounded border border-[#30363d]">
            Красная стрелка = Спуск (Градиент)
          </div>
        </div>

        {/* Sliders & Values */}
        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Координата X:</span>
              <span className="text-[#58a6ff] font-semibold">{probeX.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-2.6"
              max="2.6"
              step="0.1"
              value={probeX}
              onChange={e => setProbeX(parseFloat(e.target.value))}
              className="w-full accent-[#58a6ff] cursor-pointer"
            />
          </div>

          <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Координата Y:</span>
              <span className="text-[#bc8cff] font-semibold">{probeY.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-2.6"
              max="2.6"
              step="0.1"
              value={probeY}
              onChange={e => setProbeY(parseFloat(e.target.value))}
              className="w-full accent-[#bc8cff] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
              <span className="text-[10px] text-[#8b949e] block">Высота Z</span>
              <span className="text-sm font-bold text-[#3fb950]">{currentZ.toFixed(2)}</span>
            </div>
            <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d]">
              <span className="text-[10px] text-[#8b949e] block">Крутизна склона</span>
              <span className="text-sm font-bold text-[#f87171]">{gradMag.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] text-xs text-[#8b949e] leading-relaxed">
            💡 На самом дне чаши (в точке минимума) крутизна равна нулю, и шарик останавливается.
          </div>
        </div>
      </div>
    </div>
  );
};
