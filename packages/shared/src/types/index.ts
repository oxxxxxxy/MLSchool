export type GradeLevel = 'middle-school' | 'high-school';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  mathFormula?: string;
  options: QuizOption[];
  hint: string;
  points: number;
}

export interface SandboxConfig {
  id: string;
  type: string;
  title: string;
  description: string;
  defaultParams: Record<string, any>;
}

export interface LessonSection {
  id: string;
  title: string;
  badge?: string;
  content: string[]; // Markdown / text paragraphs
  keyTakeaway: string;
  formula?: {
    latex: string;
    description: string;
    variables: { symbol: string; name: string; meaning: string }[];
  };
  sandboxId?: string;
}

export interface Lesson {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  xpReward: number;
  icon: string;
  summary: string;
  color: string;
  sections: LessonSection[];
  sandboxes: SandboxConfig[];
  quiz: QuizQuestion[];
}

export interface UserProgress {
  userId: string;
  xp: number;
  level: number;
  completedLessons: number[];
  quizScores: Record<number, number>; // lessonId -> score
  unlockedBadges: string[];
  lastActiveLessonId: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredXp?: number;
  requiredLesson?: number;
}
