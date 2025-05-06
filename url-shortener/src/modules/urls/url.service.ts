import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../cache/cache.service';
import { Url } from './interfaces/url.interface';
import { retryOperation } from '../../common/utils/retry.util';
import { getConfig } from '../../common/config/configuration';
import * as shortid from 'shortid';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel('Url') private readonly urlModel: Model<Url>,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}

  async createShortLink(originalUrl: string): Promise<string> {
    const config = getConfig(this.configService);
    const shortCode = shortid.generate();

    const operation = async () => {
      const url = new this.urlModel({ shortCode, originalUrl, clicks: 0 });
      await url.save();
      await this.cacheService.set(`short:${shortCode}`, originalUrl);
      return shortCode;
    };

    return retryOperation(operation, this.configService);
  }

  async getOriginalUrl(shortCode: string): Promise<string> {
    const config = getConfig(this.configService);

    const operation = async () => {
      // Cache Aside Pattern
      const cachedUrl = await this.cacheService.get(`short:${shortCode}`);
      if (cachedUrl) 
        return cachedUrl;

      const url = await this.urlModel.findOneAndUpdate(
        { shortCode },
        { $inc: { clicks: 1 } },
        { new: true },
      );

      if (!url) throw new Error('Link not found');
      await this.cacheService.set(`short:${shortCode}`, url.originalUrl);
      return url.originalUrl;
    };

    return retryOperation(operation, this.configService);
  }
}