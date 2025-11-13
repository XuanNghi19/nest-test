import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationQueryDto } from 'src/shared/dtos/pagination-query.dto';
import { PaginatedResponse } from 'src/shared/dtos/paginated-response.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/find_all')
  getUsers(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<User>> {
    return this.userService.findAll(paginationQueryDto);
  }

  @Get('/profile')
  getProfile(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }
}
