import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { resolve } from 'path';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Загрузка .env файла из корня проекта
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, '../../.env'),
      isGlobal: true,
    }),

    UsersModule,

    // BullModule с конфигурацией из .env
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST_LOCAL || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      }),
    }),

    BullModule.registerQueue({
      name: 'usersQueue',
    }),
  ],
})
export class AppModule {}
