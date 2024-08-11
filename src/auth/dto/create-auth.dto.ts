import { IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  password: string;

  @IsString()
  loginOrEmail: string;
}
