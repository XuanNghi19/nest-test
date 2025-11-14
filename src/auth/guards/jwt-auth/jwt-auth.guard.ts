import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// kich hoat JwtStrategy
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
