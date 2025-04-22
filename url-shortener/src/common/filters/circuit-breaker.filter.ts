import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getConfig } from '../config/configuration';
import { Response } from 'express';

@Catch()
export class CircuitBreakerFilter implements ExceptionFilter {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private readonly maxFailures = 5;
  private readonly timeout = 30000; // 30s

  constructor(private configService: ConfigService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const config = getConfig(this.configService);

    if (!config.patterns.circuitBreaker) {
      return response.status(500).json({ message: 'Internal server error' });
    }

    if (this.state === 'OPEN') {
      return response.status(503).json({ message: 'Service unavailable' });
    }

    this.failureCount++;
    if (this.failureCount >= this.maxFailures) {
      this.state = 'OPEN';
      setTimeout(() => {
        this.state = 'HALF_OPEN';
        this.failureCount = 0;
      }, this.timeout);
    }

    response.status(500).json({ message: 'Internal server error' });
  }
}