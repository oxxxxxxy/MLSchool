import { Injectable } from '@nestjs/common';
import { UserProgress } from '@ml-school/shared';

@Injectable()
export class ProgressService {
  // In-memory progress store (can be synced with Prisma / Postgres / SQLite)
  private progressStore: Map<string, UserProgress> = new Map();

  getProgress(userId: string): UserProgress {
    if (!this.progressStore.has(userId)) {
      this.progressStore.set(userId, {
        userId,
        xp: 0,
        level: 1,
        completedLessons: [],
        quizScores: {},
        unlockedBadges: [],
        lastActiveLessonId: 1
      });
    }
    return this.progressStore.get(userId)!;
  }

  saveLessonCompletion(userId: string, lessonId: number, xpGained: number, badgeId?: string): UserProgress {
    const current = this.getProgress(userId);
    if (!current.completedLessons.includes(lessonId)) {
      current.completedLessons.push(lessonId);
    }
    current.xp += xpGained;
    current.level = Math.floor(current.xp / 200) + 1;
    current.lastActiveLessonId = lessonId;
    if (badgeId && !current.unlockedBadges.includes(badgeId)) {
      current.unlockedBadges.push(badgeId);
    }
    this.progressStore.set(userId, current);
    return current;
  }

  saveQuizScore(userId: string, lessonId: number, score: number): UserProgress {
    const current = this.getProgress(userId);
    current.quizScores[lessonId] = Math.max(current.quizScores[lessonId] || 0, score);
    this.progressStore.set(userId, current);
    return current;
  }

  getAllProgress(): UserProgress[] {
    return Array.from(this.progressStore.values());
  }
}
