import { Module } from '@nestjs/common';
import { LessonsModule } from './modules/lessons/lessons.module';
import { ProgressModule } from './modules/progress/progress.module';
import { SandboxModule } from './modules/sandbox/sandbox.module';

@Module({
  imports: [LessonsModule, ProgressModule, SandboxModule]
})
export class AppModule {}
