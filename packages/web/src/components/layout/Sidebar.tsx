import React from 'react';
import { Lesson } from '@ml-school/shared';
import { CheckCircle2, Clock, ChevronRight } from 'lucide-react';

interface SidebarProps {
  lessons: Lesson[];
  activeLessonId: number;
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
  return (
    <aside
      className={`${
        isMobileDrawer
          ? 'w-full p-4 space-y-2 bg-[#161b22] border-b border-[#30363d]'
          : 'w-64 flex-shrink-0 border-r border-[#30363d] bg-[#0d1117] p-4 space-y-2 overflow-y-auto hidden md:block'
      }`}
    >
      <div className="text-[11px] font-mono uppercase tracking-wider text-[#8b949e] px-2 pb-2 border-b border-[#30363d] flex items-center justify-between">
        <span>Уроки</span>
        <span className="text-[#58a6ff]">{completedLessonIds.length}/{lessons.length}</span>
      </div>

      <div className="space-y-1 pt-1">
        {lessons.map((lesson, idx) => {
          const isActive = lesson.id === activeLessonId;
          const isCompleted = completedLessonIds.includes(lesson.id);

          return (
            <button
              key={lesson.id}
              onClick={() => {
                onSelectLesson(lesson.id);
                if (onCloseMobileDrawer) onCloseMobileDrawer();
              }}
              className={`w-full text-left p-2.5 rounded-md transition-colors border text-xs ${
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
                    {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                  </span>
                  <span>Урок {idx + 1}</span>
                </div>
                <span className="text-[10px] font-mono text-[#d29922]">+{lesson.xpReward} XP</span>
              </div>

              <div className="line-clamp-2 leading-snug text-[#c9d1d9]">
                {lesson.title}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
