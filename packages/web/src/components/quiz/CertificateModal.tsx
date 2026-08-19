import React, { useRef } from 'react';
import { Award, CheckCircle2, Download, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  totalXp: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName = 'Юный Датасаентист (7 Класс)',
  totalXp
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl text-center space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Card */}
        <div
          ref={certRef}
          className="relative p-8 rounded-2xl bg-gradient-to-b from-slate-950 via-indigo-950/50 to-slate-950 border-2 border-amber-500/40 text-center space-y-4 shadow-inner overflow-hidden"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 text-amber-400/40 text-xs font-serif">✦ ✦ ✦</div>
          <div className="absolute top-2 right-2 text-amber-400/40 text-xs font-serif">✦ ✦ ✦</div>
          <div className="absolute bottom-2 left-2 text-amber-400/40 text-xs font-serif">✦ ✦ ✦</div>
          <div className="absolute bottom-2 right-2 text-amber-400/40 text-xs font-serif">✦ ✦ ✦</div>

          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Award className="w-8 h-8 text-slate-950" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
              ПОЧЁТНЫЙ СЕРТИФИКАТ ВЫПУСКНИКА
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-2">
              Математический Фундамент ML
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Настоящий сертификат подтверждает, что
            </p>
          </div>

          <div className="py-2 border-b border-t border-amber-500/30">
            <h3 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300">
              {studentName}
            </h3>
          </div>

          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            Успешно освоил фундаментальные концепции: <strong>Функции и Черный ящик</strong>, <strong>Линейные уравнения $y = kx + b$</strong>, <strong>Параболы и Минимум Ошибки (Loss)</strong>, <strong>Производные $f'(x)$</strong>, а также <strong>Векторы и Графы Нейросетей</strong>.
          </p>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs">
            <div className="text-left">
              <span className="text-slate-500 block text-[10px] uppercase">Набрано опыта:</span>
              <span className="font-extrabold text-amber-400 text-sm">{totalXp} XP ⚡</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="text-left">
              <span className="text-slate-500 block text-[10px] uppercase">Статус:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Готов к Machine Learning
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            Салют победы!
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
