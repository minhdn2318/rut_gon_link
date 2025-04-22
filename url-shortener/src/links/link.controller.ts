import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { CreateLinkDto } from './dto/create-link.dto';
import { RedirectLinkDto } from './dto/redirect-link.dto';
import { CreateShortLinkCommand } from './commands/create-short-link.command';
import { GetOriginalLinkQuery } from './queries/get-original-link.query';
import { LinkService } from './link.service';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { getConfig } from '../common/config/configuration';
import { Response } from 'express';

@Controller()
export class LinkController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly linkService: LinkService,
    private readonly configService: ConfigService,
  ) {}

  @Post('create')
  @RateLimit(new ConfigService()) // Pass ConfigService instance
  async create(@Body() createLinkDto: CreateLinkDto): Promise<string> {
    const config = getConfig(this.configService);
    if (config.patterns.cqrs) {
      return this.commandBus.execute(new CreateShortLinkCommand(createLinkDto.originalUrl));
    }
    return this.linkService.createShortLink(createLinkDto.originalUrl);
  }

  @Get('short/:shortCode')
  @RateLimit(new ConfigService()) // Pass ConfigService instance
  async redirect(@Param() redirectLinkDto: RedirectLinkDto, @Res() res: Response) {
    const config = getConfig(this.configService);
    const originalUrl = config.patterns.cqrs
      ? await this.queryBus.execute(new GetOriginalLinkQuery(redirectLinkDto.shortCode))
      : await this.linkService.getOriginalUrl(redirectLinkDto.shortCode);
    return res.redirect(originalUrl);
  }
}