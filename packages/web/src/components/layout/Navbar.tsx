import React from 'react';
import { Brain, Flame, Trophy, GraduationCap, Menu, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NavbarProps {
  xp: number;
  level: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  onOpenCertificate?: () => void;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  xp,
  level,
  completedLessonsCount,
  totalLessonsCount,
  onOpenCertificate,
  onToggleMobileMenu,
  isMobileMenuOpen
}) => {
  const isAllCompleted = completedLessonsCount >= totalLessonsCount && totalLessonsCount > 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left: Mobile menu toggle + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            aria-label="Меню уроков"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/90 flex items-center justify-center shadow-md shadow-indigo-600/20 text-white flex-shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  ML School
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md">
                  7 КЛАСС
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Stats & Diploma */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* XP & Level */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-2.5 sm:px-3 py-1 shadow-sm">
            <Flame className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="text-left">
              <div className="text-[11px] sm:text-xs font-bold text-slate-200 flex items-center gap-1">
                <span>Ур. {level}</span>
                <span className="text-[10px] text-amber-400 font-mono font-bold">{xp} XP</span>
              </div>
            </div>
          </div>

          {/* Completed counter (Tablet+) */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1 text-xs text-slate-300 font-semibold">
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span>{completedLessonsCount}/{totalLessonsCount}</span>
          </div>

          {/* Certificate Button */}
          <button
            onClick={() => {
              if (onOpenCertificate) onOpenCertificate();
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isAllCompleted
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">Диплом</span>
          </button>
        </div>
      </div>
    </header>
  );
};
