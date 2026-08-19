import React from 'react';
import { Award, X } from 'lucide-react';
import { MathText } from '../math/MathText';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  totalXp: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName = 'Ученик 7 Класса',
  totalXp
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-xl bg-[#161b22] border border-[#30363d] p-6 space-y-4 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 mx-auto rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#d29922]">
          <Award className="w-5 h-5" />
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e]">
            Сертификат о прохождении
          </span>
          <h2 className="text-lg font-bold text-[#f0f6fc] mt-1">
            Математический Фундамент ML
          </h2>
          <p className="text-xs text-[#8b949e] mt-0.5">
            Подтверждает успешное освоение программы
          </p>
        </div>

        <div className="py-2 border-t border-b border-[#30363d]">
          <span className="text-base font-semibold text-[#f0f6fc] font-mono">
            {studentName}
          </span>
        </div>

        <div className="text-xs text-[#8b949e] leading-relaxed">
          <MathText text="Освоены темы: $y = f(x)$, прямая $y = kx + b$, производная $f'(x)$ и 3D градиент." />
        </div>

        <div className="p-2.5 rounded bg-[#0d1117] border border-[#30363d] flex justify-around text-xs font-mono">
          <div>
            <span className="text-[#8b949e] block text-[10px]">Набрано XP</span>
            <span className="text-[#d29922] font-semibold">{totalXp} XP</span>
          </div>
          <div className="h-5 w-px bg-[#30363d]" />
          <div>
            <span className="text-[#8b949e] block text-[10px]">Статус</span>
            <span className="text-[#3fb950] font-semibold">Готов к ML</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs font-mono border border-[#30363d] transition-colors"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};
