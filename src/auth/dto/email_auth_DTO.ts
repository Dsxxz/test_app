import { IsEmail, IsString } from 'class-validator';

export class Email_Auth_DTO {
  @IsEmail()
  @IsString()
  email: string;
}
