import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { getConfig } from '../common/config/configuration';

@Injectable()
export class CacheService {
  private redis: Redis;

  constructor(private configService: ConfigService) {
    const config = getConfig(this.configService);
    this.redis = new Redis({
      host: config.cache.host,
      port: config.cache.port,
    });
  }

  async get(key: string): Promise<string | null> {
    const config = getConfig(this.configService);
    if (!config.cache.enabled) 
      return undefined;
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttlInSeconds?: number): Promise<void> {
    const config = getConfig(this.configService);
    ttlInSeconds = config.cache.ttl;
    if (!config.cache.enabled) 
      return;
    const result = await this.redis.set(key, value, 'EX', ttlInSeconds);

  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}