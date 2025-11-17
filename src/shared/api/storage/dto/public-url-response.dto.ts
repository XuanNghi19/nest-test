import { PublicUrlData } from './public-url-data.dto';

export class PublicUrlResponse {
  data: PublicUrlData;

  constructor(partial: Partial<PublicUrlResponse>) {
    Object.assign(this, partial);
  }
}
