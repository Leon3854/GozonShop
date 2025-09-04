import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

dotenv.config({ path: resolve(__dirname, '../../../.env') });

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Включаем shutdown hooks для Prisma
  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // Используем порт из .env или 3202 по умолчанию
  await app.listen(3000);

  console.log('Application is running on port 3000');
}

bootstrap()
  .then(() => console.log('Application started successfully'))
  .catch((error) => {
    console.error('Application failed to start', error);
    process.exit(1);
  });
