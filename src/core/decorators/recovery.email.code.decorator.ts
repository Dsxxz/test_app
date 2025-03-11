import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { Injectable } from "@nestjs/common";
import { UsersService } from "../../features/users/application/users.service";

@ValidatorConstraint({name: 'IsEmailRegistrated', async: true})
@Injectable()
export class IsEmailAlreadyRegistered implements ValidatorConstraintInterface {
  constructor(protected userService: UsersService,) {
  }

  async validate(email: string) {
    const user = await this.userService.findOne(email)
    return !!user;
  }

  //TODO: check validate logic result
}
  export const IsEmailRegistered =
    (ValidationOptions?: ValidationOptions) =>
      (object: object, propertyName: string) => {
        registerDecorator({
          target: object.constructor,
          propertyName: propertyName,
          options: ValidationOptions,
          constraints:[],
          validator: IsEmailAlreadyRegistered,
        })
      }
