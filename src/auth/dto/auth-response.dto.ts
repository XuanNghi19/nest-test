import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty()
  token: string;

  @ApiProperty()
  authenticated: boolean;

  constructor(token: string, authenticated: boolean) {
    this.token = token;
    this.authenticated = authenticated;
  }
}
