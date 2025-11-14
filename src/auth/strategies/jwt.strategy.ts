import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

// 'jwt' là tên mặc định
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      // chi dinh cach lay token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? '123456',
    });
  }

  async validate(payload: { email: string; sub: string }) {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      return null;
    }

    return user;
  }
}
