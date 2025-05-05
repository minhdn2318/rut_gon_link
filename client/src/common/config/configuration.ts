import { ConfigService } from '@nestjs/config';

export const getConfig = (configService: ConfigService) => ({
  enviroment: {
    mode: configService.get<string>('NODE_ENV', 'development'),
  },
  server: {
    doMain: configService.get<string>('URL_SHORTENER_DOMAIN', 'http://riot360.net:5000'),
  },
  circuitBreaker: {
    circuitBreaker: configService.get<string>('CIRCUIT_BREAKER_ENABLED', 'true') === 'true',
    timeout: configService.get<number>('CIRCUIT_BREAKER_TIMEOUT', 3000),
    errorThresholdPercentage: configService.get<number>('CIRCUIT_BREAKER_ERROR_THRESHOLD', 50),
    resetTimeout: configService.get<number>('CIRCUIT_BREAKER_RESET_TIMEOUT', 10000),
  },
  rateLimit: {
    rateLimiting: configService.get<string>('RATE_LIMIT_ENABLED', 'true') === 'true',
    ttl: configService.get<number>('RATE_LIMIT_TTL', 60), // 1 minute
    limit: configService.get<number>('RATE_LIMIT_COUNT', 100),
  },
});