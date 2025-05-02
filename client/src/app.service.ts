import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CircuitBreakerService } from './modules/circuit-breaker/circuit-breaker.service';
import { ConfigService } from '@nestjs/config';
import { getConfig } from './common/config/configuration';

@Injectable()
export class AppService {

  constructor(private readonly httpService: HttpService,
    private readonly circuitBreakerService: CircuitBreakerService,
    private readonly configService: ConfigService
  ) {}

  async createShortUrl(originUrl : string){
    const config = getConfig(this.configService);
    const url = `${config.server.doMain}/create`;
    try 
    {
      return this.circuitBreakerService.execute(() =>
        firstValueFrom(        
          this.httpService.post(url, {
          originalUrl: originUrl,
        }, {
          headers: { 'Content-Type': 'application/json' },
        })
      ));

    } catch (error) {
      return { message: 'Error while creating data', error: error.message };
    }
  }

  async getOriginUrl(shortUrl : string) : Promise<string> {
    const config = getConfig(this.configService);
    const url = `${config.server.doMain}/short/${shortUrl}`;
    try 
    {
      return this.circuitBreakerService.execute(() =>
        firstValueFrom(this.httpService.get(url))
      );
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async testCircuitBreaker() : Promise<string> {
    return this.circuitBreakerService.execute(() => {
      return new Promise((_, reject) => {
        reject({ response: { status: 500, message: 'Simulated Server Error' } });
      });
    });
  }
}
