import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtConstants } from '../../features/auth/constants/jwtConstants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const isAccessTokenValid = await this.jwtService.verify(token, {
        secret: jwtConstants.accessTokenSecret,
      });
      const payload: any = await this.jwtService.verify(token, {
        secret: isAccessTokenValid
          ? jwtConstants.accessTokenSecret
          : jwtConstants.refreshTokenSecret,
      });
      request['user'] = payload;
      request['user']['userId'] = payload.userId;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
