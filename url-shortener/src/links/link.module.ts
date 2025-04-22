import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { LinkSchema } from '../database/schemas/link.schema';
import { CreateShortLinkHandler } from './commands/handlers/create-short-link.handler';
import { GetOriginalLinkHandler } from './queries/handlers/get-original-link.handler';
import { CacheModule } from '../cache/cache.module';
import { getConfig } from '../common/config/configuration';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Link', schema: LinkSchema }]),
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
  controllers: [LinkController],
  providers: [LinkService, CreateShortLinkHandler, GetOriginalLinkHandler],
})
export class LinksModule {}