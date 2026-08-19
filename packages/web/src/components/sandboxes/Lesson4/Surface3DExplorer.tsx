import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, Sparkles, Layers, MousePointer } from 'lucide-react';
import { FormulaView } from '../../math/FormulaView';

type SurfaceType = 'bowl' | 'saddle' | 'double_well';

export const Surface3DExplorer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [surfaceType, setSurfaceType] = useState<SurfaceType>('bowl');
  const [probeX, setProbeX] = useState<number>(1.8);
  const [probeY, setProbeY] = useState<number>(1.2);
  const [rotAngle, setRotAngle] = useState<number>(45);
  const [tiltAngle, setTiltAngle] = useState<number>(35);
  const [zoom, setZoom] = useState<number>(26);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const evalZ = (x: number, y: number, type: SurfaceType): number => {
    switch (type) {
      case 'bowl':
        return 0.2 * (x * x + y * y);
      case 'saddle':
        return 0.18 * (x * x - y * y);
      case 'double_well':
        return 0.08 * (Math.pow(x, 4) - 6 * x * x + 3 * y * y) + 1.5;
      default:
        return 0.2 * (x * x + y * y);
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
    if (t < 0.25) {
      const u = t / 0.25;
      return `rgb(${Math.round(56 * u)}, ${Math.round(189 * u)}, 248)`;
    } else if (t < 0.5) {
      const u = (t - 0.25) / 0.25;
      return `rgb(${Math.round(56 + (16 - 56) * u)}, ${Math.round(189 + (185 - 189) * u)}, ${Math.round(248 + (129 - 248) * u)})`;
    } else if (t < 0.75) {
      const u = (t - 0.5) / 0.25;
      return `rgb(${Math.round(16 + (245 - 16) * u)}, ${Math.round(185 + (158 - 185) * u)}, ${Math.round(129 + (11 - 129) * u)})`;
    } else {
      const u = (t - 0.75) / 0.25;
      return `rgb(${Math.round(245 + (244 - 245) * u)}, ${Math.round(158 + (63 - 158) * u)}, ${Math.round(11 + (94 - 11) * u)})`;
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

    const radYaw = (rotAngle * Math.PI) / 180;
    const radPitch = (tiltAngle * Math.PI) / 180;
    const cosYaw = Math.cos(radYaw);
    const sinYaw = Math.sin(radYaw);
    const cosPitch = Math.cos(radPitch);
    const sinPitch = Math.sin(radPitch);

    const project3D = (x: number, y: number, z: number) => {
      const rx = x * cosYaw - y * sinYaw;
      const ry = x * sinYaw + y * cosYaw;
      const rz = z * cosPitch - ry * sinPitch;
      const finalY = z * sinPitch + ry * cosPitch;

      const screenX = width / 2 + rx * zoom;
      const screenY = height / 2 + 50 - finalY * zoom;
      return { px: screenX, py: screenY, depth: rz };
    };

    const range = 3.2;
    const step = 0.4;
    let minZ = 999, maxZ = -999;
    for (let x = -range; x <= range; x += step) {
      for (let y = -range; y <= range; y += step) {
        const z = evalZ(x, y, surfaceType);
        if (z < minZ) minZ = z;
        if (z > maxZ) maxZ = z;
      }
    }

    // Draw Colored Mesh
    for (let y = -range; y <= range; y += step) {
      ctx.beginPath();
      let first = true;
      for (let x = -range; x <= range; x += 0.15) {
        const z = evalZ(x, y, surfaceType);
        const { px, py } = project3D(x, y, z);
        if (first) { ctx.moveTo(px, py); first = false; }
        else { ctx.lineTo(px, py); }
      }
      const avgZ = evalZ(0, y, surfaceType);
      ctx.strokeStyle = getZColor(avgZ, minZ, maxZ);
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.65;
      ctx.stroke();
    }

    for (let x = -range; x <= range; x += step) {
      ctx.beginPath();
      let first = true;
      for (let y = -range; y <= range; y += 0.15) {
        const z = evalZ(x, y, surfaceType);
        const { px, py } = project3D(x, y, z);
        if (first) { ctx.moveTo(px, py); first = false; }
        else { ctx.lineTo(px, py); }
      }
      const avgZ = evalZ(x, 0, surfaceType);
      ctx.strokeStyle = getZColor(avgZ, minZ, maxZ);
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.65;
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Probe Point
    const probePoint = project3D(probeX, probeY, currentZ);

    // Downhill Gradient Vector Arrow
    const norm = gradMag > 0.01 ? gradMag : 1;
    const arrowLen = 1.3;
    const arrowTargetX = probeX - (gx / norm) * arrowLen;
    const arrowTargetY = probeY - (gy / norm) * arrowLen;
    const arrowTargetZ = evalZ(arrowTargetX, arrowTargetY, surfaceType);
    const arrowHead = project3D(arrowTargetX, arrowTargetY, arrowTargetZ);

    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(probePoint.px, probePoint.py);
    ctx.lineTo(arrowHead.px, arrowHead.py);
    ctx.stroke();
    ctx.shadowBlur = 0;

    const headAngle = Math.atan2(arrowHead.py - probePoint.py, arrowHead.px - probePoint.px);
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(arrowHead.px, arrowHead.py);
    ctx.lineTo(arrowHead.px - 10 * Math.cos(headAngle - Math.PI / 6), arrowHead.py - 10 * Math.sin(headAngle - Math.PI / 6));
    ctx.lineTo(arrowHead.px - 10 * Math.cos(headAngle + Math.PI / 6), arrowHead.py - 10 * Math.sin(headAngle + Math.PI / 6));
    ctx.fill();

    // Probe Dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(probePoint.px, probePoint.py, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.stroke();

  }, [probeX, probeY, rotAngle, tiltAngle, zoom, surfaceType, currentZ, gx, gy, gradMag]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setRotAngle(prev => (prev + dx * 0.7) % 360);
    setTiltAngle(prev => Math.max(5, Math.min(85, prev + dy * 0.5)));
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMousePos.current.x;
    const dy = e.touches[0].clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setRotAngle(prev => (prev + dx * 0.7) % 360);
    setTiltAngle(prev => Math.max(5, Math.min(85, prev + dy * 0.5)));
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setZoom(prev => Math.max(15, Math.min(45, prev - e.deltaY * 0.03)));
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 space-y-4 sm:space-y-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
            Интерактивный 3D Градиент
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white">3D Ландшафт: Вращай график пальцем или мышкой</h3>
        </div>

        {/* Surface switcher */}
        <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSurfaceType('bowl')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              surfaceType === 'bowl' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🥣 Чаша
          </button>
          <button
            onClick={() => setSurfaceType('double_well')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              surfaceType === 'double_well' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ 2 Ямы
          </button>
          <button
            onClick={() => setSurfaceType('saddle')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              surfaceType === 'saddle' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏔️ Седло
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
        {/* 3D Canvas */}
        <div className="relative w-full max-w-[480px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-inner cursor-grab active:cursor-grabbing touch-none">
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

          <div className="absolute top-2.5 left-2.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] font-mono font-bold text-indigo-300">
            {surfaceType === 'bowl' ? 'z = 0.2(x² + y²)' : surfaceType === 'double_well' ? 'z = 0.08(x⁴ - 6x² + 3y²)' : 'z = 0.18(x² - y²)'}
          </div>

          <div className="absolute bottom-2 left-2 text-[9px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            👆 Зажми и крути в 3D
          </div>
        </div>

        {/* Sliders & Data */}
        <div className="flex-1 w-full space-y-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-indigo-300">Позиция X:</span>
              <span className="text-indigo-400 font-mono">{probeX.toFixed(1)}</span>
            </div>
            <input type="range" min="-2.8" max="2.8" step="0.1" value={probeX} onChange={e => setProbeX(parseFloat(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-purple-300">Позиция Y:</span>
              <span className="text-purple-400 font-mono">{probeY.toFixed(1)}</span>
            </div>
            <input type="range" min="-2.8" max="2.8" step="0.1" value={probeY} onChange={e => setProbeY(parseFloat(e.target.value))} className="w-full accent-purple-500 cursor-pointer" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Высота Z</span>
              <span className="text-lg font-black font-mono text-emerald-400">{currentZ.toFixed(2)}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Крутизна склона</span>
              <span className="text-lg font-black font-mono text-rose-400">{gradMag.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
            🔴 <strong>Стрелка спуска:</strong> В реальном ИИ алгоритм всегда шагает вдоль этой красной стрелки, чтобы оказаться на самом дне функции ошибки!
          </div>
        </div>
      </div>
    </div>
  );
};
