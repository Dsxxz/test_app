import { IsString } from 'class-validator';

export class CreateAuthLoginDto {
  @IsString()
  password: string;

  @IsString()
  loginOrEmail: string;
}
