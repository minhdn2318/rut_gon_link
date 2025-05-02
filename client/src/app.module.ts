import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CircuitBreakerModule } from './modules/circuit-breaker/circuit-breaker.module';
import { RateLimitModule } from './modules/rate-limit/rate-limit.module';

@Module({
  imports: [HttpModule,
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env',
    }),
    CircuitBreakerModule,
    RateLimitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
