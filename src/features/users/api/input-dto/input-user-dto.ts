import { Injectable } from '@nestjs/common';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength
} from "class-validator";
import { IsString } from 'class-validator';
import { IsLoginUnique } from '../../../../core/decorators/unique.login.decorator';
import { IsEmailUnique } from '../../../../core/decorators/unique.email.decorator';
import { IsCodeConfirmed } from '../../../../core/decorators/confirmation.code.decorator';

@Injectable()
export class InputUserDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(10)
  @Matches('^[a-zA-Z0-9_-]*$')
  @IsLoginUnique({ message: 'User with this username already exists' })
  login: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  @IsEmailUnique({ message: 'User with this email already exists' })
  email: string;
}

@Injectable()
export class VerifyEmailDto {
  @IsString()
  @IsCodeConfirmed({ message: 'email already confirmed' })
  code: string;
}
