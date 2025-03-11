import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../features/users/application/users.service';

@ValidatorConstraint({ name: 'IsEmailConfirmed', async: true })
@Injectable()
export class IsEmailAlreadyConfirmed implements ValidatorConstraintInterface {
  constructor(protected userService: UsersService) {}
  async validate(email: string) {
    const user = await this.userService.findOne(email);
    return user ? !user.emailConfirmation.isConfirmed : false;
  }
}

export const IsEmailConfirmed =
  (validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyConfirmed,
    });
  };
