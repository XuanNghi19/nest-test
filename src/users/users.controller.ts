import {
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationQueryDto } from 'src/shared/dtos/pagination-query.dto';
import { PaginatedResponse } from 'src/shared/dtos/paginated-response.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { CreateUploadPipe } from 'src/shared/pipes/create-upload.pipe';
import * as path from 'path';
import { StorageService } from 'src/shared/api/storage/storage.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('find_all')
  @ApiCreatedResponse({ type: PaginatedResponse<User> })
  async getUsers(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<User>> {
    return this.userService.findAll(paginationQueryDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('me')
  @ApiCreatedResponse({ type: User })
  async getProfile(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Put('me/avatar')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: User })
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Req() req: any,
    @UploadedFile(CreateUploadPipe(10 * 1024 * 1024, '.(jpg|jpeg|png)'))
    file: Express.Multer.File,
  ): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user: User = req.user;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    const fileExtension = path.extname(file.originalname);
    const uniqueFileName = `public/${user.id}${fileExtension}`;

    const uploadImage = await this.storageService.uploadFile(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      file.buffer,
      uniqueFileName,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      file.mimetype,
    );

    return this.userService.updateAvatar(user.id, uploadImage);
  }
}
