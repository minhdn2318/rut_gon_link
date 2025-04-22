import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlSchema } from '../database/schemas/url.schema';
import { CreateShortUrlHandler } from './commands/handlers/create-short-url.handler';
import { GetOriginalUrlHandler } from './queries/handlers/get-original-url.handler';
import { CacheModule } from '../cache/cache.module';
import { getConfig } from '../common/config/configuration';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Url', schema: UrlSchema }]),
    CqrsModule,
    CacheModule,
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = getConfig(configService);
        return [
          {
            name: 'default',
            ttl: config.rateLimit.ttl * 1000, // Convert seconds to milliseconds
            limit: config.rateLimit.limit,
          },
        ];
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UrlController],
  providers: [UrlService, CreateShortUrlHandler, GetOriginalUrlHandler],
})
export class UrlModule {}