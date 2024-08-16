import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { basicConstants } from '../constants/basicConstants';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  public async validate(Username: string, Password: string) {
    if (
      basicConstants.username === Username &&
      basicConstants.password === Password
    ) {
      return true;
    }
    throw new UnauthorizedException({ message: 'Incorrect credentials' });
  }
}
