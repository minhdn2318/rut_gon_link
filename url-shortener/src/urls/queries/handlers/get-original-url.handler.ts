import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { UrlService } from '../../url.service';
import { GetOriginalUrlQuery } from '../get-original-url.query';

@QueryHandler(GetOriginalUrlQuery)
export class GetOriginalUrlHandler implements IQueryHandler<GetOriginalUrlQuery> {
  constructor(private readonly urlService: UrlService) {}

  async execute(query: GetOriginalUrlQuery): Promise<string> {
    return this.urlService.getOriginalUrl(query.shortCode);
  }
}