import { ConfigService } from '@nestjs/config';

export const getConfig = (configService: ConfigService) => ({
  database: {
    uri: configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/url-shortener'),
    sharding: configService.get<boolean>('SHARDING_ENABLED', false),
  },
  cache: {
    enabled: configService.get<boolean>('CACHE_ENABLED', true),
    ttl: configService.get<number>('CACHE_TTL', 3600), // 1 hour
    host: configService.get<string>('REDIS_HOST', 'redis'),
    port: configService.get<number>('REDIS_PORT', 6379),
  },
  patterns: {
    cqrs: configService.get<boolean>('CQRS_ENABLED', true),
    retry: configService.get<boolean>('RETRY_ENABLED', true),
  },
});