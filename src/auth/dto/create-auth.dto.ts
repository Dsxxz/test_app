import { IsEmail, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  password: string;

  @IsEmail()
  loginOrEmail: string;
}
