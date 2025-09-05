import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: any = null;
  private channel: any = null;

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.closeConnection();
  }

  private async connect() {
    try {
      const rabbitmqUrl = process.env.RABBITMQ_URL;
      if (!rabbitmqUrl) {
        throw new Error('RABBITMQ_URL is not defined');
      }

      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange('user.events', 'topic', {
        durable: true,
      });

      console.log('RabbitMQ connected successfully');
    } catch (error) {
      console.error('RabbitMQ connection failed:', error);
      setTimeout(() => {
        void this.connect();
      }, 5000);
    }
  }

  async publish(exchange: string, routingKey: string, message: any) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      const buffer = Buffer.from(JSON.stringify(message));
      this.channel.publish(exchange, routingKey, buffer, { persistent: true });
    } catch (error) {
      console.error('Publish error:', error);
    }
  }

  async consume<T>(
    queue: string,
    routingKey: string,
    callback: (message: T) => Promise<void>,
  ) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      await this.channel.assertQueue(queue, { durable: true });
      await this.channel.bindQueue(queue, 'user.events', routingKey);

      await this.channel.consume(queue, async (msg) => {
        if (msg !== null) {
          try {
            const content = JSON.parse(msg.content.toString()) as T;
            await callback(content);
            this.channel.ack(msg);
          } catch (error) {
            console.error('Message processing error:', error);
            this.channel.nack(msg, false, false);
          }
        }
      });
    } catch (error) {
      console.error('Consume error:', error);
    }
  }

  private async closeConnection() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }
}
