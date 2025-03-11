import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { Injectable } from "@nestjs/common";
import { UsersService } from "../../features/users/application/users.service";

@ValidatorConstraint({ name: 'IsCodeConfirmed', async: true })
@Injectable()
export class IsCodeAlreadyConfirmed implements ValidatorConstraintInterface {
  constructor(
    protected userService: UsersService,
  ) {}
  async validate(code: string) {
    const user = await this.userService.findUserByCode(code);
    if (!user) {
      return false;
    }
    return !user.emailConfirmation.isConfirmed;
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
