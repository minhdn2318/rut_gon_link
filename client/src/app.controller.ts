import { Controller, Get, Post, Res, Param, Query, UseGuards, Render, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { CustomRateLimitGuard } from './modules/rate-limit/rate-limit.guard';

@UseGuards(CustomRateLimitGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create')
  async create(@Body('url') url: string) {
    const shortCode = await this.appService.createShortUrl(url);
    return { shortCode };
  }

  @Get('short/:id')
  @Render('redirect-link')
  async getOrigin(@Param('id') id: string) {
    const origin = await this.appService.getOriginUrl(id);
    return { origin };
  }

  @Get('test-circuit-breaker')
  async testCircuitBreaker() {
    return this.appService.testCircuitBreaker();
  }

  @Get('/')
  @Render('create-link')
  renderCreateLinkPage() {
    return {};
  }
}
