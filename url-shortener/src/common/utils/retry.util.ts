import { ConfigService } from '@nestjs/config';
import { getConfig } from '../config/configuration';

export async function retryOperation<T>(
  operation: () => Promise<T>,
  configService: ConfigService,
  maxAttempts = 3,
  delay = 1000,
): Promise<T> {
  const config = getConfig(configService);
  if (!config.patterns.retry) return operation();

  let lastError: Error;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}