import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { loadConfig } from './config/configuration';

async function bootstrap(): Promise<void> {
  loadConfig();

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Включаем shutdown hooks для Prisma
  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // Используем порт из .env или 3202 по умолчанию
  await app.listen(process.env.PORT || 3202);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap()
  .then(() => console.log('Application started successfully'))
  .catch((error) => {
    console.error('Application failed to start', error);
    process.exit(1);
  });
