import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Login } from './dto/login.dto';
import { AuthResponse } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email da ton tai');
    }

    const user = await this.userService.create(createUserDto);
    return user;
  }

  // validate User: day func LocalStrategy se goi
  async validateUser(login: Login): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findOneByEmail(login.email);

    if (
      user &&
      (await this.userService.validatePassword(user, login.password))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Thong tin dang nhap khong chinh xac');
  }

  async login(user: Omit<User, 'password'>): Promise<AuthResponse> {
    const payload = {
      email: user.email,
      sub: user.id, // cho jwt
    };
    const token = await this.jwtService.signAsync(payload);
    return new AuthResponse(token, true);
  }
}
