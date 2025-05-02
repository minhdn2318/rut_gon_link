import { Controller, Get, Post, Res,Param, Query, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { CustomRateLimitGuard } from './modules/rate-limit/rate-limit.guard';

@UseGuards(CustomRateLimitGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create')
  async create(@Query ('url') url : string) {
    const res = await this.appService.createShortUrl(url);
    return res.data;
  }

  @Get('short/:id')
  async getOrigin(@Param('id') id: string, @Res() res: Response) {
    const origin = await this.appService.getOriginUrl(id);
    return res.send(origin);
  }

  @Get('test-circuit-breaker')
  async testCircuitBreaker() {
    return this.appService.testCircuitBreaker();
  }
}
