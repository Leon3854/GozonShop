import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor(private configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST_DOCKER') || 'redis',
      port: parseInt(this.configService.get('REDIS_PORT') || '6379'),
    });
  }

  async setRefreshToken(userId: string, token: string): Promise<void> {
    await this.redisClient.setex(
      `refresh_token:${userId}`,
      7 * 24 * 60 * 60, // 7 дней
      token,
    );
  }

  async validateRefreshToken(userId: string, token: string): Promise<boolean> {
    const storedToken = await this.redisClient.get(`refresh_token:${userId}`);
    return storedToken === token;
  }

  async invalidateRefreshToken(userId: string): Promise<void> {
    await this.redisClient.del(`refresh_token:${userId}`);
  }

  async addToBlacklist(token: string, seconds: number): Promise<void> {
    await this.redisClient.setex(`blacklist:${token}`, seconds, '1');
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.redisClient.exists(`blacklist:${token}`);
    return result === 1;
  }
}
