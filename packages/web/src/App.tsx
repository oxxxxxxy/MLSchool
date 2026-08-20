import React, { useState } from 'react';
import { LESSONS_DATABASE } from '../../api/src/modules/lessons/lessons.data';
import { Lesson, UserProgress } from '@ml-school/shared';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MathText } from './components/math/MathText';
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

// Lesson 3 Sandboxes (ML Overview)
import { MLSuperpowersMap } from './components/sandboxes/Lesson4/MLSuperpowersMap';
import { TaskClassifierGame } from './components/sandboxes/Lesson4/TaskClassifierGame';

// Lesson 4 Sandboxes (Regression)
import { PizzaPricePredictor } from './components/sandboxes/Lesson5/PizzaPricePredictor';
import { BestFitLineGame } from './components/sandboxes/Lesson5/BestFitLineGame';

// Lesson 5 Sandboxes (Classification)
import { CatVsDogClassifier } from './components/sandboxes/Lesson6/CatVsDogClassifier';
import { SpamFilterSimulator } from './components/sandboxes/Lesson6/SpamFilterSimulator';

// Lesson 6 Sandboxes (Derivatives, 3D & CV)
import { SecantToTangentVisualizer } from './components/sandboxes/Lesson4/SecantToTangentVisualizer';
import { SlopeTriangleInspector } from './components/sandboxes/Lesson2/SlopeTriangleInspector';
import { DerivativeMicroscope } from './components/sandboxes/Lesson4/DerivativeMicroscope';
import { Surface3DExplorer } from './components/sandboxes/Lesson4/Surface3DExplorer';
import { CVEdgeDetectionDemo } from './components/sandboxes/Lesson4/CVEdgeDetectionDemo';
import { BlindHikerGradientGame } from './components/sandboxes/Lesson4/BlindHikerGradientGame';

// Lesson 7 Sandboxes (Clustering)
import { StarClusterExplorer } from './components/sandboxes/Lesson7/StarClusterExplorer';
import { MusicTasteClustering } from './components/sandboxes/Lesson7/MusicTasteClustering';

import { ArrowRight, ArrowLeft } from 'lucide-react';
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
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
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
      case 'ml-superpowers-map': return <MLSuperpowersMap />;
      case 'task-classifier-game': return <TaskClassifierGame />;
      case 'pizza-price-predictor': return <PizzaPricePredictor />;
      case 'best-fit-line-game': return <BestFitLineGame />;
      case 'cat-dog-classifier': return <CatVsDogClassifier />;
      case 'spam-filter-sim': return <SpamFilterSimulator />;
      case 'secant-to-tangent': return <SecantToTangentVisualizer />;
      case 'slope-triangle-inspector': return <SlopeTriangleInspector />;
      case 'derivative-microscope': return <DerivativeMicroscope />;
      case 'surface-3d-explorer': return <Surface3DExplorer />;
      case 'cv-edge-detection': return <CVEdgeDetectionDemo />;
      case 'blind-hiker-game': return <BlindHikerGradientGame />;
      case 'star-cluster-explorer': return <StarClusterExplorer />;
      case 'music-taste-clustering': return <MusicTasteClustering />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-[#c9d1d9]">
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

      <div className="flex-1 max-w-6xl w-full mx-auto flex">
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

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-3xl mx-auto w-full">
          {/* Lesson Header */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#8b949e]">Урок {currentLesson.id} из {lessons.length}</span>
              <span className="text-[#d29922] font-semibold">+{currentLesson.xpReward} XP</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#f0f6fc] tracking-tight">
              {currentLesson.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#8b949e] leading-relaxed">
              <MathText text={currentLesson.subtitle} />
            </p>

            <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs text-[#8b949e] leading-relaxed">
              <MathText text={currentLesson.summary} />
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {currentLesson.sections.map((section) => (
              <section key={section.id} className="space-y-3">
                <div className="space-y-1">
                  {section.badge && (
                    <span className="text-[10px] font-mono text-[#58a6ff] bg-[#58a6ff]/10 px-1.5 py-0.5 rounded border border-[#58a6ff]/20">
                      {section.badge}
                    </span>
                  )}
                  <h2 className="text-base sm:text-lg font-semibold text-[#f0f6fc] tracking-tight">
                    {section.title}
                  </h2>
                </div>

                {/* Paragraphs with MathText */}
                <div className="space-y-2 text-xs sm:text-sm text-[#c9d1d9] leading-relaxed">
                  {section.content.map((p, pIdx) => (
                    <div key={pIdx}>
                      <MathText text={p} />
                    </div>
                  ))}
                </div>

                {/* Formula Box */}
                {section.formula && (
                  <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
                    <span className="text-[11px] font-mono text-[#8b949e] block">
                      {section.formula.description}
                    </span>

                    <div className="py-2 px-3 text-center text-base sm:text-lg font-mono text-[#f0f6fc] bg-[#0d1117] rounded-lg border border-[#30363d] overflow-x-auto">
                      <FormulaView latex={section.formula.latex} displayMode={true} />
                    </div>

                    {section.formula.variables && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 border-t border-[#30363d]">
                        {section.formula.variables.map((v, vIdx) => (
                          <div key={vIdx} className="p-2 rounded bg-[#0d1117] border border-[#30363d] text-xs">
                            <span className="font-mono text-[#d29922] font-semibold">{v.symbol}</span>
                            <span className="text-[#8b949e] ml-1.5">— {v.name}:</span>
                            <p className="text-[#8b949e] text-[11px] mt-0.5">{v.meaning}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Key Takeaway */}
                <div className="p-3 rounded-lg bg-[#0d1117] border-l-2 border-[#58a6ff] text-xs text-[#8b949e] leading-relaxed">
                  <strong className="text-[#f0f6fc]">Ключевая мысль: </strong>
                  <MathText text={section.keyTakeaway} />
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

          {/* Quiz Section */}
          <section className="pt-6 border-t border-[#30363d]">
            <QuizRunner
              lessonId={currentLesson.id}
              lessonTitle={currentLesson.title}
              questions={currentLesson.quiz}
              xpReward={currentLesson.xpReward}
              onComplete={handleLessonComplete}
            />
          </section>

          {/* Navigation Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#30363d] gap-2">
            <button
              disabled={activeLessonId === 1}
              onClick={handlePrevLesson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] disabled:opacity-40 disabled:cursor-not-allowed text-[#c9d1d9] font-mono text-xs border border-[#30363d] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Назад</span>
            </button>

            <button
              onClick={handleNextLesson}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white font-mono text-xs font-medium transition-colors"
            >
              <span>{activeLessonId < lessons.length ? 'Следующий урок' : '🎓 Диплом'}</span>
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
