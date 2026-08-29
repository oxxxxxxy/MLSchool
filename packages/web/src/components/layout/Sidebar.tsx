import React from 'react';
import { Lesson } from '@ml-school/shared';
import { CheckCircle2, Award } from 'lucide-react';

interface SidebarProps {
  lessons: Lesson[];
  activeLessonId: number; // 0 for Final Exam, 1..12 for lessons
  completedLessonIds: number[];
  onSelectLesson: (id: number) => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  lessons,
  activeLessonId,
  completedLessonIds,
  onSelectLesson,
  isMobileDrawer = false,
  onCloseMobileDrawer
}) => {
  const part1Lessons = lessons.filter(l => l.id <= 7);
  const part2Lessons = lessons.filter(l => l.id > 7);

  const renderLessonButton = (lesson: Lesson) => {
    const isActive = lesson.id === activeLessonId;
    const isCompleted = completedLessonIds.includes(lesson.id);

    return (
      <button
        key={lesson.id}
        onClick={() => {
          onSelectLesson(lesson.id);
          if (onCloseMobileDrawer) onCloseMobileDrawer();
        }}
        className={`w-full text-left p-2.5 rounded-lg transition-colors border text-xs ${
          isActive
            ? 'bg-[#161b22] border-[#58a6ff] text-[#f0f6fc] font-medium'
            : 'bg-transparent border-transparent text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9]'
        }`}
      >
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span
              className={`w-4 h-4 rounded flex items-center justify-center ${
                isCompleted
                  ? 'bg-[#238636]/20 text-[#3fb950]'
                  : isActive
                  ? 'bg-[#58a6ff]/20 text-[#58a6ff]'
                  : 'text-[#8b949e]'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : lesson.id}
            </span>
            <span>Урок {lesson.id}</span>
          </div>
          <span className="text-[10px] font-mono text-[#d29922]">+{lesson.xpReward} XP</span>
        </div>

        <div className="line-clamp-2 leading-snug text-[#c9d1d9] text-[11px]">
          {lesson.title.replace(/^Урок \d+\.\s*/, '')}
        </div>
      </button>
    );
  };

  return (
    <aside
      className={`${
        isMobileDrawer
          ? 'w-full p-4 space-y-4 bg-[#161b22] border-b border-[#30363d]'
          : 'w-72 flex-shrink-0 border-r border-[#30363d] bg-[#0d1117] p-4 space-y-4 overflow-y-auto hidden md:block'
      }`}
    >
      <div className="text-[11px] font-mono uppercase tracking-wider text-[#8b949e] px-2 pb-2 border-b border-[#30363d] flex items-center justify-between">
        <span>Программа ML Kids</span>
        <span className="text-[#58a6ff]">{completedLessonIds.length}/{lessons.length}</span>
      </div>

      {/* Part 1 */}
      <div className="space-y-1">
        <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-[#58a6ff] font-bold">
          Часть I. Фундамент & Задачи (1–7)
        </div>
        {part1Lessons.map(renderLessonButton)}
      </div>

      {/* Part 2 */}
      <div className="space-y-1 pt-2">
        <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-[#d29922] font-bold">
          Часть II. Линейная регрессия (8–12)
        </div>
        {part2Lessons.map(renderLessonButton)}
      </div>

      {/* Final Exam */}
      <div className="pt-2 border-t border-[#30363d]">
        <button
          onClick={() => {
            onSelectLesson(0);
            if (onCloseMobileDrawer) onCloseMobileDrawer();
          }}
          className={`w-full text-left p-3 rounded-lg transition-colors border text-xs ${
            activeLessonId === 0
              ? 'bg-[#161b22] border-[#d29922] text-[#f0f6fc] font-bold'
              : 'bg-[#161b22]/50 border-[#30363d] text-[#d29922] hover:bg-[#161b22]'
          }`}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#d29922]">
              <Award className="w-4 h-4" />
              <span>Финальный Экзамен</span>
            </div>
            <span className="text-[10px] font-mono text-[#3fb950] font-bold">🏆 Сертификат</span>
          </div>
          <div className="text-[11px] text-[#8b949e]">
            Аттестация по линейной регрессии из 5 частей
          </div>
        </button>
      </div>
    </aside>
  );
};
