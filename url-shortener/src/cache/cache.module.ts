import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { getConfig } from '../common/config/configuration';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheService } from './cache.service';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const config = getConfig(configService);
        return {
          store: await redisStore({
            url: configService.get<string>('REDIS_Url', 'redis://localhost:6379'),
          }),
          ttl: config.cache.ttl,
          isGlobal: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}