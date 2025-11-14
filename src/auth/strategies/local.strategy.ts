import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../auth.service';
import { Login } from '../dto/login.dto';
import { Strategy } from 'passport-local';

// 'local' la ten mac dinh
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // bao cho passport biet ta dung 'email' thay vi 'username'
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(
      new Login(email, password),
    );

    return user;
  }
}
