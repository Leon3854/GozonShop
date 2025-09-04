import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../shared/rabbitmq/rabbitmq.service';
import { PrismaService } from '../prisma.service';

interface UserCreatedMessage {
  eventId: string;
  eventType: string;
  timestamp: string;
  payload: {
    userId: string;
    email: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    createdAt: string;
  };
}

interface UserDeletedMessage {
  eventId: string;
  eventType: string;
  timestamp: string;
  payload: {
    userId: string;
  };
}

@Injectable()
export class UserConsumer implements OnModuleInit {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.setupConsumers();
  }

  private async setupConsumers() {
    // Обработка создания пользователя
    await this.rabbitMQService.consume<UserCreatedMessage>(
      'user.create.queue',
      'user.create',
      async (message) => {
        await this.handleUserCreate(message);
      },
    );

    // Обработка удаления пользователя
    await this.rabbitMQService.consume<UserDeletedMessage>(
      'user.delete.queue',
      'user.delete',
      async (message) => {
        await this.handleUserDelete(message);
      },
    );
  }

  private async handleUserCreate(message: UserCreatedMessage) {
    try {
      console.log('Creating user from RabbitMQ message:', message);

      const {
        userId,
        email,
        username,
        first_name,
        last_name,
        phone,
        createdAt,
      } = message.payload;

      // Создаем пользователя в user DB
      await this.prisma.user.create({
        data: {
          id: userId,
          email: email,
          username: username || `user_${userId.slice(0, 8)}`, // имя по умолчанию
          first_name: first_name || '',
          last_name: last_name || '',
          phone: phone || '',
          createdAt: new Date(createdAt),
          updateAt: new Date(createdAt),
        },
      });

      console.log(`User created successfully from RabbitMQ: ${userId}`);
    } catch (error) {
      console.error('Error creating user from RabbitMQ:', error);
      if (error.code !== 'P2002') {
        // P2002 - unique constraint violation
        throw error;
      }
    }
  }

  private async handleUserDelete(message: UserDeletedMessage) {
    try {
      const { userId } = message.payload;

      await this.prisma.user.delete({
        where: { id: userId },
      });

      console.log(`User deleted from RabbitMQ: ${userId}`);
    } catch (error) {
      console.error('Error deleting user from RabbitMQ:', error);
      // Если пользователь не найден - это нормально (уже удален)
      if (error.code !== 'P2025') {
        // P2025 - record not found
        throw error;
      }
    }
  }
}
