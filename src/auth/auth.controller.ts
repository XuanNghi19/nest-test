/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { AuthResponse } from './dto/auth-response.dto';
import { Login } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ type: User })
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiCreatedResponse({ type: AuthResponse })
  async login(@Req() req: any, @Body() login: Login) {
    // @Req() la doi tuong Request day du cua Express
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.authService.login(req.user);
  }
}
