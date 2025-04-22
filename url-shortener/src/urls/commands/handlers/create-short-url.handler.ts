import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UrlService } from '../../url.service';
import { CreateShortUrlCommand } from '../create-short-url.command';

@CommandHandler(CreateShortUrlCommand)
export class CreateShortUrlHandler implements ICommandHandler<CreateShortUrlCommand> {
  constructor(private readonly urlService: UrlService) {}

  async execute(command: CreateShortUrlCommand): Promise<string> {
    return this.urlService.createShortLink(command.originalUrl);
  }
}