import { applyDecorators } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { getConfig } from '../config/configuration';

export function RateLimit(configService: ConfigService) {
  const config = getConfig(configService);
  if (!config.patterns.rateLimiting) return applyDecorators();
  return applyDecorators(
    Throttle({
      default: {
        ttl: config.rateLimit.ttl * 1000, // Convert seconds to milliseconds
        limit: config.rateLimit.limit,
      },
    }),
  );
}