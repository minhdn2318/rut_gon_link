import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerStorageService, ThrottlerModuleOptions } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { getConfig } from '../../common/config/configuration';


@Injectable()
export class CustomRateLimitGuard extends ThrottlerGuard {
  constructor(
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorageService,
    reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super(options, storageService, reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const config = getConfig(this.configService);
    if (config.rateLimit.rateLimiting) {
      console.log('rate limiting enable');
      return super.canActivate(context);
    } else {
      console.log('rate limiting disenable');
      return true;
    }
  }

  protected async throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: any): Promise<void> {
    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Too Many Requests. Please wait a time!',
        error: 'Too Many Requests',
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
