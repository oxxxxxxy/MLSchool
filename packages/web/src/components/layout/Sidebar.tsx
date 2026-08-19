import React from 'react';
import { Lesson } from '@ml-school/shared';
import { CheckCircle2, Clock, Sparkles, ChevronRight, BookOpen } from 'lucide-react';

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
          ? 'w-full p-4 space-y-4 bg-slate-950 border-b border-slate-800'
          : 'w-72 flex-shrink-0 border-r border-slate-800/80 bg-slate-950 p-4 space-y-4 overflow-y-auto hidden md:block'
      }`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Уроки курса
          </span>
        </div>
        <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
          {lessons.length} Урока
        </span>
      </div>

      <div className="space-y-2">
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
              className={`w-full text-left p-3 rounded-2xl transition-all duration-200 border relative group ${
                isActive
                  ? 'bg-slate-900 border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/30'
                  : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-md text-[11px] font-extrabold flex items-center justify-center ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                    Урок {idx + 1}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                  +{lesson.xpReward} XP
                </div>
              </div>

              <h4
                className={`mt-1.5 text-xs font-bold leading-snug line-clamp-2 ${
                  isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                }`}
              >
                {lesson.title}
              </h4>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-600" />
                  <span>{lesson.durationMinutes} мин</span>
                </div>
                <div className="flex items-center gap-1 text-indigo-400 font-medium">
                  <span>{lesson.sandboxes.length} интерактива</span>
                  <ChevronRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
