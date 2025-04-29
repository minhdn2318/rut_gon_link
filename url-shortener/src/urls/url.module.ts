import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlSchema } from '../database/schemas/url.schema';
import { CreateShortUrlHandler } from './commands/handlers/create-short-url.handler';
import { GetOriginalUrlHandler } from './queries/handlers/get-original-url.handler';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Url', schema: UrlSchema }]),
    CqrsModule,
    CacheModule,
  ],
  controllers: [UrlController],
  providers: [UrlService, CreateShortUrlHandler, GetOriginalUrlHandler],
})
export class UrlModule {}