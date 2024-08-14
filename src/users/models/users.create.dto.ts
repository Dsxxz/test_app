import { Injectable } from '@nestjs/common';
import { Prop } from '@nestjs/mongoose';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@Injectable()
export class CreateUserDto {
  @Prop()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(10)
  @Matches('^[a-zA-Z0-9_-]*$')
  login: string;

  @Prop()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @Prop()
  @IsNotEmpty()
  @IsEmail()
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  email: string;
}
import { IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  code: string;
}
