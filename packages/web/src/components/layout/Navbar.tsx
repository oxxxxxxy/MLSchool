import React from 'react';
import { BookOpen, Trophy, Zap, Menu, X, Award } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full border-b border-[#30363d] bg-[#161b22]/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded-md text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-colors"
            aria-label="Меню уроков"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#58a6ff]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#f0f6fc] tracking-tight">
                MLSchool
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono text-[#8b949e] bg-[#21262d] border border-[#30363d] rounded">
                7 класс
              </span>
            </div>
          </div>
        </div>

        {/* Right: Progress & Diploma */}
        <div className="flex items-center gap-2.5">
          {/* Level & XP */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0d1117] border border-[#30363d] text-xs font-mono">
            <Zap className="w-3.5 h-3.5 text-[#d29922]" />
            <span className="text-[#8b949e]">Ур.{level}</span>
            <span className="text-[#d29922] font-semibold">{xp} XP</span>
          </div>

          {/* Completed count */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0d1117] border border-[#30363d] text-xs font-mono text-[#8b949e]">
            <Trophy className="w-3.5 h-3.5 text-[#3fb950]" />
            <span>{completedLessonsCount}/{totalLessonsCount}</span>
          </div>

          {/* Certificate Button */}
          <button
            onClick={onOpenCertificate}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors border ${
              isAllCompleted
                ? 'bg-[#238636] hover:bg-[#2ea043] text-white border-[#2ea043]'
                : 'bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border-[#30363d]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Диплом</span>
          </button>
        </div>
      </div>
    </header>
  );
};
