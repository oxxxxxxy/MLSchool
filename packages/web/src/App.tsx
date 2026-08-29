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
import { FunctionConveyor } from './components/sandboxes/Lesson1/FunctionConveyor';
import { CartesianTracerPro } from './components/sandboxes/Lesson1/CartesianTracerPro';
import { SneakToZero } from './components/sandboxes/Lesson1/SneakToZero';
import { RuleBreakerGame } from './components/sandboxes/Lesson1/RuleBreakerGame';

// Lesson 2 Sandboxes
import { RotateLineInspector } from './components/sandboxes/Lesson2/RotateLineInspector';
import { TwoDialsLab } from './components/sandboxes/Lesson2/TwoDialsLab';
import { TaxiFareBuilder } from './components/sandboxes/Lesson2/TaxiFareBuilder';
import { TwoPointsLineDrag } from './components/sandboxes/Lesson2/TwoPointsLineDrag';

// Lesson 3 Sandboxes
import { SecantToTangentVisualizer } from './components/sandboxes/Lesson4/SecantToTangentVisualizer';
import { SlopeDirectionQuest } from './components/sandboxes/Lesson3/SlopeDirectionQuest';
import { Bowl3DGradient } from './components/sandboxes/Lesson3/Bowl3DGradient';
import { CVEdgeDetectionDemo } from './components/sandboxes/Lesson4/CVEdgeDetectionDemo';

// Lesson 4 Sandboxes
import { MLvsClassicDiagram } from './components/sandboxes/Lesson4/MLvsClassicDiagram';
import { RegressionMiniPreview } from './components/sandboxes/Lesson4/RegressionMiniPreview';
import { TaskSorter12Game } from './components/sandboxes/Lesson4/TaskSorter12Game';

// Lesson 5 Sandboxes
import { PredictionTracer } from './components/sandboxes/Lesson5/PredictionTracer';
import { NoiseCloudLab } from './components/sandboxes/Lesson5/NoiseCloudLab';
import { VisualLineFitting } from './components/sandboxes/Lesson5/VisualLineFitting';

// Lesson 6 Sandboxes
import { ThresholdClassifier1D } from './components/sandboxes/Lesson6/ThresholdClassifier1D';
import { CatsDogsBoundary } from './components/sandboxes/Lesson6/CatsDogsBoundary';
import { SpamFilterSimulator } from './components/sandboxes/Lesson6/SpamFilterSimulator';
import { DigitRecognizerMini } from './components/sandboxes/Lesson6/DigitRecognizerMini';

// Lesson 7 Sandboxes
import { CandyGroupingLab } from './components/sandboxes/Lesson7/CandyGroupingLab';
import { EuclideanDistanceExplorer } from './components/sandboxes/Lesson7/EuclideanDistanceExplorer';
import { KMeansStepByStepFull } from './components/sandboxes/Lesson7/KMeansStepByStepFull';

// Lesson 8 Sandboxes
import { TrueVsPredictedResidual } from './components/sandboxes/Lesson8/TrueVsPredictedResidual';
import { ErrorCancellationLab } from './components/sandboxes/Lesson8/ErrorCancellationLab';
import { SquaredPenaltyComparison } from './components/sandboxes/Lesson8/SquaredPenaltyComparison';

// Lesson 9 Sandboxes
import { MSEStepByStepCalc } from './components/sandboxes/Lesson9/MSEStepByStepCalc';
import { TwoWorldsSplitScreen } from './components/sandboxes/Lesson9/TwoWorldsSplitScreen';

// Lesson 10 Sandboxes
import { FreezeBInteractive } from './components/sandboxes/Lesson10/FreezeBInteractive';
import { FormulaCardAssembler } from './components/sandboxes/Lesson10/FormulaCardAssembler';

// Lesson 11 Sandboxes
import { RealtimeTrainingStudio } from './components/sandboxes/Lesson11/RealtimeTrainingStudio';
import { ThreeLearningRatesRace } from './components/sandboxes/Lesson11/ThreeLearningRatesRace';

// Lesson 12 Sandboxes
import { PythonInterpreterSimulator } from './components/sandboxes/Lesson12/PythonInterpreterSimulator';
import { TrainTestSplitter } from './components/sandboxes/Lesson12/TrainTestSplitter';

// Final Exam
import { FinalRegressionExam } from './components/exam/FinalRegressionExam';

import { ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [lessons] = useState<Lesson[]>(LESSONS_DATABASE);
  const [activeLessonId, setActiveLessonId] = useState<number>(1); // 0 = Exam, 1..12 = Lessons
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
      setActiveLessonId(0); // Move to Final Exam
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonId === 0) {
      setActiveLessonId(lessons.length);
    } else if (activeLessonId > 1) {
      setActiveLessonId(prev => prev - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSandbox = (sandboxId: string) => {
    switch (sandboxId) {
      // Lesson 1
      case 'function-conveyor': return <FunctionConveyor />;
      case 'cartesian-tracer-pro': return <CartesianTracerPro />;
      case 'sneak-to-zero': return <SneakToZero />;
      case 'rule-breaker-game': return <RuleBreakerGame />;

      // Lesson 2
      case 'rotate-line-inspector': return <RotateLineInspector />;
      case 'two-dials-lab': return <TwoDialsLab />;
      case 'taxi-fare-builder': return <TaxiFareBuilder />;
      case 'two-points-line-drag': return <TwoPointsLineDrag />;

      // Lesson 3
      case 'secant-to-tangent': return <SecantToTangentVisualizer />;
      case 'slope-direction-quest': return <SlopeDirectionQuest />;
      case 'bowl-3d-gradient': return <Bowl3DGradient />;
      case 'cv-edge-detection': return <CVEdgeDetectionDemo />;

      // Lesson 4
      case 'ml-vs-classic-diagram': return <MLvsClassicDiagram />;
      case 'regression-mini-preview': return <RegressionMiniPreview />;
      case 'task-sorter-12-game': return <TaskSorter12Game />;

      // Lesson 5
      case 'prediction-tracer': return <PredictionTracer />;
      case 'noise-cloud-lab': return <NoiseCloudLab />;
      case 'visual-line-fitting': return <VisualLineFitting />;

      // Lesson 6
      case 'threshold-classifier-1d': return <ThresholdClassifier1D />;
      case 'cats-dogs-boundary': return <CatsDogsBoundary />;
      case 'spam-filter-sim': return <SpamFilterSimulator />;
      case 'digit-recognizer-mini': return <DigitRecognizerMini />;

      // Lesson 7
      case 'candy-grouping-lab': return <CandyGroupingLab />;
      case 'euclidean-distance-explorer': return <EuclideanDistanceExplorer />;
      case 'kmeans-step-by-step-full': return <KMeansStepByStepFull />;

      // Lesson 8
      case 'true-vs-predicted-residual': return <TrueVsPredictedResidual />;
      case 'error-cancellation-lab': return <ErrorCancellationLab />;
      case 'squared-penalty-comparison': return <SquaredPenaltyComparison />;

      // Lesson 9
      case 'mse-step-by-step-calc': return <MSEStepByStepCalc />;
      case 'two-worlds-split-screen': return <TwoWorldsSplitScreen />;

      // Lesson 10
      case 'freeze-b-interactive': return <FreezeBInteractive />;
      case 'formula-card-assembler': return <FormulaCardAssembler />;

      // Lesson 11
      case 'realtime-training-studio': return <RealtimeTrainingStudio />;
      case 'three-learning-rates-race': return <ThreeLearningRatesRace />;

      // Lesson 12
      case 'python-interpreter-simulator': return <PythonInterpreterSimulator />;
      case 'train-test-splitter': return <TrainTestSplitter />;

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
          {activeLessonId === 0 ? (
            /* Final Exam View */
            <FinalRegressionExam />
          ) : (
            /* Standard Lesson View */
            <>
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
                  <span>{activeLessonId < lessons.length ? 'Следующий урок' : '🏆 К Финальному Экзамену'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
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
