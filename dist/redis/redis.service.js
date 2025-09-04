"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let RedisService = class RedisService {
    configService;
    redisClient;
    constructor(configService) {
        this.configService = configService;
        this.redisClient = new ioredis_1.Redis({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
        });
    }
    async setRefreshToken(userId, token) {
        await this.redisClient.setex(`refresh_token:${userId}`, 7 * 24 * 60 * 60, // 7 дней
        token);
    }
    async validateRefreshToken(userId, token) {
        const storedToken = await this.redisClient.get(`refresh_token:${userId}`);
        return storedToken === token;
    }
    async invalidateRefreshToken(userId) {
        await this.redisClient.del(`refresh_token:${userId}`);
    }
    async addToBlacklist(token, seconds) {
        await this.redisClient.setex(`blacklist:${token}`, seconds, '1');
    }
    async isTokenBlacklisted(token) {
        const result = await this.redisClient.exists(`blacklist:${token}`);
        return result === 1;
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
