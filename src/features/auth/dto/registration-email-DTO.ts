import { IsEmail, IsString } from 'class-validator';
import { IsEmailConfirmed } from '../../../core/decorators/confirmation.email.decorator';
import { Injectable } from '@nestjs/common';
import { IsEmailRegistered } from "../../../core/decorators/recovery.email.code.decorator";
@Injectable()
export class RegistrationEmailDTO {
  @IsEmail()
  @IsString()
  @IsEmailConfirmed({ message: 'Email already confirmed' })
  email: string;
}

@Injectable()
export class PasswordRecoveryEmailDTO {
  @IsEmail()
  @IsString()
  //@IsEmailRegistered({message: 'Email is not registered'})
  email: string;
}
