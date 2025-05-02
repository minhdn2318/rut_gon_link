import { Injectable } from '@nestjs/common';
import * as CircuitBreaker from 'opossum';
import { ConfigService } from '@nestjs/config';
import { getConfig } from '../../common/config/configuration';

@Injectable()
export class CircuitBreakerService {
  private breaker: CircuitBreaker;

  constructor(private readonly configService: ConfigService) {
    const config = getConfig(this.configService);
    const options = {
      timeout: config.circuitBreaker.timeout,
      errorThresholdPercentage: config.circuitBreaker.errorThresholdPercentage,
      resetTimeout: config.circuitBreaker.resetTimeout,
    };

    this.breaker = new CircuitBreaker(this.requestWithBreaker.bind(this), options);

    // Optional: Logging
    this.breaker.on('open', () => console.log('⚠️ Circuit Breaker OPEN - Service may be down.'));
    this.breaker.on('halfOpen', () => console.log('✅ Circuit Breaker HALF OPEN - Service is testing.'));
    this.breaker.on('close', () => console.log('✅ Circuit Breaker CLOSED - Service is healthy.'));

  }

  async requestWithBreaker(requestFunc: () => Promise<any>) {
    try {
      const response = await requestFunc();
      return response;
    } catch (error) {
      if (error.response?.status === 500) {
        console.error('🚨 Detected 500 error - Activating circuit breaker.');
        throw error;
      } else {
        console.warn(`⚠️ Ignoring error ${error.response?.status}:`, error.message);
        return { message: 'Request failed, but circuit breaker remains closed.' };
      }
    }
  }

  async execute(requestFunc: () => Promise<any>) {
    return this.breaker.fire(requestFunc);
  }
}
