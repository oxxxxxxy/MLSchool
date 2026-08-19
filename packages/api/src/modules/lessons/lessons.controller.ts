import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { Lesson, Badge } from '@ml-school/shared';

@ApiTags('lessons')
@Controller('api/lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all math foundation lessons for ML' })
  @ApiResponse({ status: 200, description: 'List of lessons' })
  getAll(): Lesson[] {
    return this.lessonsService.getAllLessons();
  }

  @Get('badges')
  @ApiOperation({ summary: 'Get all gamification badges' })
  getBadges(): Badge[] {
    return this.lessonsService.getAllBadges();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by ID' })
  getById(@Param('id', ParseIntPipe) id: number): Lesson {
    return this.lessonsService.getLessonById(id);
  }
}
