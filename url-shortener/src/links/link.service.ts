import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../cache/cache.service';
import { Link } from './interfaces/link.interface';
import { retryOperation } from '../common/utils/retry.util';
import { getConfig } from '../common/config/configuration';
import * as shortid from 'shortid';

@Injectable()
export class LinkService {
  constructor(
    @InjectModel('Link') private readonly linkModel: Model<Link>,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}

  async createShortLink(originalUrl: string): Promise<string> {
    const config = getConfig(this.configService);
    const shortCode = shortid.generate();

    const operation = async () => {
      const link = new this.linkModel({ shortCode, originalUrl, clicks: 0 });
      await link.save();
      await this.cacheService.set(`short:${shortCode}`, originalUrl);
      return shortCode;
    };

    return retryOperation(operation, this.configService);
  }

  async getOriginalUrl(shortCode: string): Promise<string> {
    const config = getConfig(this.configService);

    const operation = async () => {
      // Cache Aside Pattern
      const cachedUrl = await this.cacheService.get<string>(`short:${shortCode}`);
      if (cachedUrl) return cachedUrl;

      const link = await this.linkModel.findOneAndUpdate(
        { shortCode },
        { $inc: { clicks: 1 } },
        { new: true },
      );

      if (!link) throw new Error('Link not found');
      await this.cacheService.set(`short:${shortCode}`, link.originalUrl);
      return link.originalUrl;
    };

    return retryOperation(operation, this.configService);
  }
}