import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LinkService } from '../../link.service';
import { CreateShortLinkCommand } from '../create-short-link.command';

@CommandHandler(CreateShortLinkCommand)
export class CreateShortLinkHandler implements ICommandHandler<CreateShortLinkCommand> {
  constructor(private readonly linkService: LinkService) {}

  async execute(command: CreateShortLinkCommand): Promise<string> {
    return this.linkService.createShortLink(command.originalUrl);
  }
}