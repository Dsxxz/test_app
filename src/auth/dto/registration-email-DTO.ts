import { IsEmail, IsString } from 'class-validator';
import { IsEmailConfirmed } from '../../validation/confirmation.email.decorator';
import { Injectable } from '@nestjs/common';
@Injectable()
export class RegistrationEmailDTO {
  @IsEmail()
  @IsString()
  @IsEmailConfirmed({ message: 'Email already confirmed' })
  email: string;
}
