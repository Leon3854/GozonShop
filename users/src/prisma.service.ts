import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      // console.log('Prisma connected to database');
    } catch (error) {
      console.error('Prisma connection error', error);
      process.exit(1);
    }
  }
  async onModuleDestroy() {
    // console.log('Prisma is disconnecting...');
    await this.$disconnect();
  }

  enableShutdownHooks(app: INestApplication) {
    app.enableShutdownHooks();
    // Здесь добавь другие действия, если необходимо
  }
}
