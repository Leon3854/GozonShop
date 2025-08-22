import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'usersQueue',
    }),
  ],
})
export class AppModule {}
