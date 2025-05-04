import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CircuitBreakerService } from './modules/circuit-breaker/circuit-breaker.service';
import { ConfigService } from '@nestjs/config';
import { getConfig } from './common/config/configuration';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private readonly circuitBreakerService: CircuitBreakerService,
    private readonly configService: ConfigService,
  ) {}

  async createShortUrl(originUrl: string): Promise<string> {
    const config = getConfig(this.configService);
    const url = `${config.server.doMain}/create`;
    try {
      if (config.circuitBreaker.circuitBreaker == true) {
        const response = await this.circuitBreakerService.execute(() =>
          firstValueFrom(
            this.httpService.post(
              url,
              {
                originalUrl: originUrl,
              },
              {
                headers: { 'Content-Type': 'application/json' },
              },
            ),
          ),
        );
        return response.data;
      } else {
        const response = await firstValueFrom(
          this.httpService.post(
            url,
            {
              originalUrl: originUrl,
            },
            {
              headers: { 'Content-Type': 'application/json' },
            },
          ),
        );
        return response.data;
      }
    } catch (error) {
      // console.error('Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getOriginUrl(shortUrl: string): Promise<string> {
    const config = getConfig(this.configService);
    const url = `${config.server.doMain}/short/${shortUrl}`;
    try {
      let responseResult = '';
      if (config.circuitBreaker.circuitBreaker == true) {
        const response = await this.circuitBreakerService.execute(() =>
          firstValueFrom(this.httpService.get(url)),
        );
        responseResult = response.data;
      } else {
        const response = await firstValueFrom(this.httpService.get(url));
        responseResult = response.data;
      }

      console.log('Response:', responseResult);
      // Chỉ lấy phần sau short/ nếu response.data là một URL
      if (typeof responseResult === 'string') {
        const match = responseResult.match(/short\/(.+)$/);
        return match ? match[1] : responseResult;
      }
      return responseResult;
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async testCircuitBreaker(): Promise<string> {
    return this.circuitBreakerService.execute(() => {
      return new Promise((_, reject) => {
        reject({
          response: { status: 500, message: 'Simulated Server Error' },
        });
      });
    });
  }
}
