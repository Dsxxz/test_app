import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

@ValidatorConstraint({ name: 'IsCodeConfirmed', async: true })
@Injectable()
export class IsCodeAlreadyConfirmed implements ValidatorConstraintInterface {
  constructor(
    protected authService: AuthService,
    protected userService: UsersService,
  ) {}
  async validate(code: string) {
    const user = await this.userService.findUserByCode(code);
    if (!user) {
      return false;
    }
    return !user;
  }
}

export const IsCodeConfirmed =
  (validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCodeAlreadyConfirmed,
    });
  };
