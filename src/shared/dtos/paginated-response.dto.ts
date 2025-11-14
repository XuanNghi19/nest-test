import { ApiProperty } from '@nestjs/swagger';

export class PaginatedMetaData {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  itemsPerPage: number;
}

export class PaginatedResponse<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  meta: PaginatedMetaData;
}
