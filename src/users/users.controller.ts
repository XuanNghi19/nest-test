import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationQueryDto } from 'src/shared/dtos/pagination-query.dto';
import { PaginatedResponse } from 'src/shared/dtos/paginated-response.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('find_all')
  @ApiCreatedResponse({ type: PaginatedResponse<User> })
  getUsers(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<User>> {
    return this.userService.findAll(paginationQueryDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('me')
  @ApiCreatedResponse({ type: User })
  getProfile(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }
}
