import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { UserProgress } from '@ml-school/shared';

@ApiTags('progress')
@Controller('api/progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user progress, XP and achievements' })
  getProgress(@Param('userId') userId: string): UserProgress {
    return this.progressService.getProgress(userId);
  }

  @Post(':userId/complete-lesson')
  @ApiOperation({ summary: 'Record lesson completion and award XP' })
  completeLesson(
    @Param('userId') userId: string,
    @Body() body: { lessonId: number; xpGained: number; badgeId?: string }
  ): UserProgress {
    return this.progressService.saveLessonCompletion(userId, body.lessonId, body.xpGained, body.badgeId);
  }

  @Post(':userId/quiz-score')
  @ApiOperation({ summary: 'Record quiz score' })
  saveQuiz(
    @Param('userId') userId: string,
    @Body() body: { lessonId: number; score: number }
  ): UserProgress {
    return this.progressService.saveQuizScore(userId, body.lessonId, body.score);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students progress (for admin)' })
  getAllProgress(): UserProgress[] {
    return this.progressService.getAllProgress();
  }
}
