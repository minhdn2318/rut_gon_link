import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { LinkService } from '../../link.service';
import { GetOriginalLinkQuery } from '../get-original-link.query';

@QueryHandler(GetOriginalLinkQuery)
export class GetOriginalLinkHandler implements IQueryHandler<GetOriginalLinkQuery> {
  constructor(private readonly linkService: LinkService) {}

  async execute(query: GetOriginalLinkQuery): Promise<string> {
    return this.linkService.getOriginalUrl(query.shortCode);
  }
}