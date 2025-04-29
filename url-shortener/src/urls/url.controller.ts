import { Controller, Post, Body, Get, Param, Res, UseGuards, UseFilters } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { CreateUrlDto } from './dto/create-url.dto';
import { RedirectUrlDto } from './dto/redirect-url.dto';
import { CreateShortUrlCommand } from './commands/create-short-url.command';
import { GetOriginalUrlQuery } from './queries/get-original-url.query';
import { UrlService } from './url.service';
import { getConfig } from '../common/config/configuration';
import { Response } from 'express';
import { CustomRateLimitGuard } from '../rate-limit/rate-limit.guard';
import { CircuitBreakerFilter } from '../common/filters/circuit-breaker.filter'

@UseGuards(CustomRateLimitGuard)
@Controller()
export class UrlController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly urlService: UrlService,
    private readonly configService: ConfigService,
  ) {}

  @Post('create')
  @UseFilters(CircuitBreakerFilter)
  async create(@Body() createLinkDto: CreateUrlDto): Promise<string> {
    const config = getConfig(this.configService);
    if (config.patterns.cqrs) {
      return this.commandBus.execute(new CreateShortUrlCommand(createLinkDto.originalUrl));
    }
    return this.urlService.createShortLink(createLinkDto.originalUrl);
  }

  @Get('short/:shortCode')
  @UseFilters(CircuitBreakerFilter)
  async redirect(@Param() redirectLinkDto: RedirectUrlDto, @Res() res: Response) {
    const config = getConfig(this.configService);
    const originalUrl = config.patterns.cqrs
      ? await this.queryBus.execute(new GetOriginalUrlQuery(redirectLinkDto.shortCode))
      : await this.urlService.getOriginalUrl(redirectLinkDto.shortCode);

    return res.send(originalUrl);
  }

  @Get('test-circuit-breaker')
  @UseFilters(CircuitBreakerFilter)
  async testCircuitBreaker() {
    throw new Error('Simulated error for circuit breaker testing');
  }
}