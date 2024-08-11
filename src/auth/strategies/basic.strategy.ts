import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { UnauthorizedException } from '@nestjs/common';
import { basicConstants } from '../constants/basicConstants';

export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  constructor() {
    super();
  }
  public async validate(username: string, password: string) {
    if (
      basicConstants.username === username &&
      basicConstants.password === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
