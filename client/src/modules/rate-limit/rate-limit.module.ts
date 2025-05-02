import { Module } from '@nestjs/common';
import { getConfig } from '../../common/config/configuration';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomRateLimitGuard } from './rate-limit.guard'

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = getConfig(configService);

        return [
          {
            name: 'default',
            ttl: config.rateLimit.ttl * 1000, 
            limit: config.rateLimit.limit,
          },
        ];
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomRateLimitGuard,
    },
    CustomRateLimitGuard,
  ],
  exports: [ThrottlerModule, CustomRateLimitGuard],
})
export class RateLimitModule {}
