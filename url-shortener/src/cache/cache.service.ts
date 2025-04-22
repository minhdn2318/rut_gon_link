import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getConfig } from '../common/config/configuration';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    const config = getConfig(this.configService);
    if (!config.cache.enabled) return undefined;
    return this.cacheManager.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const config = getConfig(this.configService);
    if (!config.cache.enabled) return;
    await this.cacheManager.set(key, value, ttl);
  }
}