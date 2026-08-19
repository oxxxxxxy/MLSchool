import React, { useState } from 'react';
import { LESSONS_DATABASE } from '../../api/src/modules/lessons/lessons.data';
import { Lesson, UserProgress } from '@ml-school/shared';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { FormulaView } from './components/math/FormulaView';
import { QuizRunner } from './components/quiz/QuizRunner';
import { CertificateModal } from './components/quiz/CertificateModal';

// Lesson 1 Sandboxes
import { MagicBlackBox } from './components/sandboxes/Lesson1/MagicBlackBox';
import { LiveCartesianTracer } from './components/sandboxes/Lesson1/LiveCartesianTracer';
import { BreakTheMachine } from './components/sandboxes/Lesson1/BreakTheMachine';
import { BlackBoxReverserGame } from './components/sandboxes/Lesson1/BlackBoxReverserGame';

// Lesson 2 Sandboxes
import { LinearLabPure } from './components/sandboxes/Lesson2/LinearLabPure';
import { TaxiMeterSimulator } from './components/sandboxes/Lesson2/TaxiMeterSimulator';
import { TwoLinesIntersectionLab } from './components/sandboxes/Lesson2/TwoLinesIntersectionLab';
import { TwoPointsDraggableLine } from './components/sandboxes/Lesson2/TwoPointsDraggableLine';
import { LaserTargetGame } from './components/sandboxes/Lesson2/LaserTargetGame';

// Lesson 3 Sandboxes
import { SecantToTangentVisualizer } from './components/sandboxes/Lesson4/SecantToTangentVisualizer';
import { SlopeTriangleInspector } from './components/sandboxes/Lesson2/SlopeTriangleInspector';
import { DerivativeMicroscope } from './components/sandboxes/Lesson4/DerivativeMicroscope';
import { Surface3DExplorer } from './components/sandboxes/Lesson4/Surface3DExplorer';
import { BlindHikerGradientGame } from './components/sandboxes/Lesson4/BlindHikerGradientGame';

import { Sparkles, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [lessons] = useState<Lesson[]>(LESSONS_DATABASE);
  const [activeLessonId, setActiveLessonId] = useState<number>(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    userId: 'student-7th-grade',
    xp: 0,
    level: 1,
    completedLessons: [],
    quizScores: {},
    unlockedBadges: [],
    lastActiveLessonId: 1
  });
  const [isCertOpen, setIsCertOpen] = useState(false);

  const currentLesson = lessons.find(l => l.id === activeLessonId) || lessons[0];

  const handleLessonComplete = (score: number) => {
    setUserProgress(prev => {
      const isNew = !prev.completedLessons.includes(activeLessonId);
      const xpGained = isNew ? currentLesson.xpReward : Math.round(currentLesson.xpReward * 0.3);
      const newXp = prev.xp + xpGained;
      const newLevel = Math.floor(newXp / 200) + 1;
      const updatedCompleted = isNew ? [...prev.completedLessons, activeLessonId] : prev.completedLessons;

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedLessons: updatedCompleted,
        quizScores: { ...prev.quizScores, [activeLessonId]: score }
      };
    });
  };

  const handleNextLesson = () => {
    if (activeLessonId < lessons.length) {
      setActiveLessonId(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsCertOpen(true);
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonId > 1) {
      setActiveLessonId(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderSandbox = (sandboxId: string) => {
    switch (sandboxId) {
      case 'magic-box': return <MagicBlackBox />;
      case 'cartesian-tracer': return <LiveCartesianTracer />;
      case 'break-machine': return <BreakTheMachine />;
      case 'reverse-engineering-game': return <BlackBoxReverserGame />;
      case 'linear-lab-pure': return <LinearLabPure />;
      case 'taxi-meter-sim': return <TaxiMeterSimulator />;
      case 'two-lines-lab': return <TwoLinesIntersectionLab />;
      case 'two-points-drag': return <TwoPointsDraggableLine />;
      case 'laser-target-game': return <LaserTargetGame />;
      case 'secant-to-tangent': return <SecantToTangentVisualizer />;
      case 'slope-triangle-inspector': return <SlopeTriangleInspector />;
      case 'derivative-microscope': return <DerivativeMicroscope />;
      case 'surface-3d-explorer': return <Surface3DExplorer />;
      case 'blind-hiker-game': return <BlindHikerGradientGame />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      <Navbar
        xp={userProgress.xp}
        level={userProgress.level}
        completedLessonsCount={userProgress.completedLessons.length}
        totalLessonsCount={lessons.length}
        onOpenCertificate={() => setIsCertOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <Sidebar
            lessons={lessons}
            activeLessonId={activeLessonId}
            completedLessonIds={userProgress.completedLessons}
            onSelectLesson={(id) => {
              setActiveLessonId(id);
              setIsMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isMobileDrawer={true}
            onCloseMobileDrawer={() => setIsMobileMenuOpen(false)}
          />
        </div>
      )}

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Sidebar */}
        <Sidebar
          lessons={lessons}
          activeLessonId={activeLessonId}
          completedLessonIds={userProgress.completedLessons}
          onSelectLesson={(id) => {
            setActiveLessonId(id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 space-y-8 md:space-y-10 overflow-y-auto max-w-4xl mx-auto w-full">
          {/* Lesson Header Banner */}
          <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Урок {currentLesson.id} из {lessons.length}</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                +{currentLesson.xpReward} XP
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-3 leading-tight">
              {currentLesson.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {currentLesson.subtitle}
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
              <span className="text-indigo-400 font-bold">💡</span>
              <p className="leading-relaxed">{currentLesson.summary}</p>
            </div>
          </div>

          {/* Lesson Sections */}
          <div className="space-y-8 sm:space-y-12">
            {currentLesson.sections.map((section) => (
              <section key={section.id} className="space-y-4 sm:space-y-5">
                <div className="space-y-1.5">
                  {section.badge && (
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                      {section.badge}
                    </span>
                  )}
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                    {section.title}
                  </h2>
                </div>

                {/* Content Paragraphs */}
                <div className="space-y-2.5 text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                  {section.content.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>

                {/* Formula Box */}
                {section.formula && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
                    <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                      {section.formula.description}
                    </span>

                    <div className="py-2.5 px-3 text-center text-lg sm:text-xl font-bold text-white bg-slate-950 rounded-xl border border-slate-800/80 overflow-x-auto">
                      <FormulaView latex={section.formula.latex} displayMode={true} />
                    </div>

                    {section.formula.variables && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                        {section.formula.variables.map((v, vIdx) => (
                          <div key={vIdx} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                            <span className="font-mono font-bold text-amber-400">{v.symbol}</span>
                            <span className="text-slate-400 font-semibold ml-1.5">— {v.name}:</span>
                            <p className="text-slate-400 text-[11px] mt-0.5">{v.meaning}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Key Takeaway */}
                <div className="p-3.5 rounded-xl bg-indigo-950/20 border-l-3 border-indigo-500 text-xs sm:text-sm text-indigo-200 font-medium leading-relaxed">
                  <strong>Ключевая мысль:</strong> {section.keyTakeaway}
                </div>

                {/* Embedded Sandbox */}
                {section.sandboxId && (
                  <div className="pt-2">
                    {renderSandbox(section.sandboxId)}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Interactive Quiz Runner */}
          <section className="pt-6 border-t border-slate-800 space-y-6">
            <QuizRunner
              lessonId={currentLesson.id}
              lessonTitle={currentLesson.title}
              questions={currentLesson.quiz}
              xpReward={currentLesson.xpReward}
              onComplete={handleLessonComplete}
            />
          </section>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800 gap-3">
            <button
              disabled={activeLessonId === 1}
              onClick={handlePrevLesson}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 font-bold text-xs transition-all border border-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Назад</span>
            </button>

            <button
              onClick={handleNextLesson}
              className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <span>{activeLessonId < lessons.length ? 'Следующий урок' : '🎓 Получить Диплом'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </main>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        totalXp={userProgress.xp}
      />
    </div>
  );
};
