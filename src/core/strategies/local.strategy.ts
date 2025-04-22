import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../features/auth/infrastructure/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ userNameField: 'login' });
    this.authService = authService;
  }

  async validate(payload: { username: string; password: string }) {
    const user = await this.authService.validate(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
//todo: this strategy is not used; need add or delete it;