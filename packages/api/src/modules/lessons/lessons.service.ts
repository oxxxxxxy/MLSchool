import { Injectable, NotFoundException } from '@nestjs/common';
import { Lesson, Badge } from '@ml-school/shared';
import { LESSONS_DATABASE, BADGES_DATABASE } from './lessons.data';

@Injectable()
export class LessonsService {
  getAllLessons(): Lesson[] {
    return LESSONS_DATABASE;
  }

  getLessonById(id: number): Lesson {
    const lesson = LESSONS_DATABASE.find(l => l.id === id);
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  getLessonBySlug(slug: string): Lesson {
    const lesson = LESSONS_DATABASE.find(l => l.slug === slug);
    if (!lesson) {
      throw new NotFoundException(`Lesson with slug ${slug} not found`);
    }
    return lesson;
  }

  getAllBadges(): Badge[] {
    return BADGES_DATABASE;
  }
}
