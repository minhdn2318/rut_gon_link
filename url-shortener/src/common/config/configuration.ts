import { ConfigService } from '@nestjs/config';

export const getConfig = (configService: ConfigService) => ({
  database: {
    uri: configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/url-shortener'),
    sharding: configService.get<string>('SHARDING_ENABLED', 'true') === 'true',
  },
  cache: {
    enabled: configService.get<string>('CACHE_ENABLED', 'true') === 'true',
    ttl: configService.get<number>('CACHE_TTL', 3600), // 1 hour
    host: configService.get<string>('REDIS_HOST', 'redis'),
    port: configService.get<number>('REDIS_PORT', 6379),
    password: configService.get<string>('REDIS_PASSWORD', 'urlShortener'),
  },
  patterns: {
    cqrs: configService.get<string>('CQRS_ENABLED', 'true') === 'true',
    retry: configService.get<string>('RETRY_ENABLED', 'true') === 'true',
  },
});