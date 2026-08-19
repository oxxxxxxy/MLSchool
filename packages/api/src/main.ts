import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('ML Kids Math School API')
    .setDescription('Backend REST API for interactive Math & ML foundation academy for middle schoolers')
    .setVersion('1.0.0')
    .addTag('lessons')
    .addTag('progress')
    .addTag('sandbox')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 NestJS Backend running at http://localhost:${port}`);
  console.log(`📚 Swagger API Docs available at http://localhost:${port}/api/docs`);
}
bootstrap();
