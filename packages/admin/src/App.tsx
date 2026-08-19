import React, { useState } from 'react';
import { LayoutDashboard, Users, BookOpen, BarChart3, Trophy, CheckCircle2, Flame, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'lessons'>('overview');

  const stats = {
    totalStudents: 142,
    avgCompletionRate: '88%',
    totalXpAwarded: '48,200',
    topLesson: 'Урок 2: Линейная функция y = kx + b'
  };

  const studentList = [
    { id: '1', name: 'Младший брат (7 класс)', progress: '5/5 уроков', xp: 1300, level: 7, status: 'Выпускник 🎓' },
    { id: '2', name: 'Артём К.', progress: '4/5 уроков', xp: 950, level: 5, status: 'Активен' },
    { id: '3', name: 'София М.', progress: '3/5 уроков', xp: 650, level: 4, status: 'Активен' },
    { id: '4', name: 'Максим Д.', progress: '5/5 уроков', xp: 1250, level: 7, status: 'Выпускник 🎓' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">ML Kids Academy — Админ-Панель</h1>
            <p className="text-xs text-slate-400">Мониторинг успеваемости и прохождения 5 уроков математики</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Обзор
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'students' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Ученики ({stats.totalStudents})
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
            <span>Всего учеников</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.totalStudents}</div>
          <span className="text-[10px] text-emerald-400 font-bold">+12 за эту неделю</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
            <span>Средний % сдачи квизов</span>
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.avgCompletionRate}</div>
          <span className="text-[10px] text-slate-500">Отличный результат</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
            <span>Выдано опыта (XP)</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{stats.totalXpAwarded}</div>
          <span className="text-[10px] text-slate-500">Геймификация активна</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
            <span>Самый популярный урок</span>
            <Trophy className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-purple-300 leading-snug line-clamp-1">{stats.topLesson}</div>
          <span className="text-[10px] text-slate-500">Интерактив: Лазерный стрелок</span>
        </div>
      </div>

      {/* Students Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Список последних учеников и статус</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                <th className="pb-3">Имя ученика</th>
                <th className="pb-3">Прогресс уроков</th>
                <th className="pb-3">Набрано XP</th>
                <th className="pb-3">Уровень</th>
                <th className="pb-3">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {studentList.map(s => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-semibold text-white">{s.name}</td>
                  <td className="py-3 text-indigo-300">{s.progress}</td>
                  <td className="py-3 font-mono text-amber-400">{s.xp} XP</td>
                  <td className="py-3 text-slate-300">{s.level} ур.</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
