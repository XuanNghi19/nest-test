import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number) // chuyen string tu query sang number
  @IsPositive({ message: 'Page phai la so duong' })
  @Min(1)
  @ApiProperty()
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: 'Page phai la so duong' })
  @ApiProperty()
  limit: number = 10;
}
