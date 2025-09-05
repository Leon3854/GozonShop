import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, '../../.env'),
      isGlobal: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
