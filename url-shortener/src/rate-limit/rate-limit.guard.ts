import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerStorageService, ThrottlerModuleOptions } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

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
    const isEnabled = this.configService.get('RATE_LIMIT_ENABLED') === 'true';
    if (!isEnabled) {
      return true;
    }
    return super.canActivate(context);
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
