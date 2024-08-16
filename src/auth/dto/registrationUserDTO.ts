import { Injectable } from '@nestjs/common';
import { Prop } from '@nestjs/mongoose';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsEmailUnique } from '../../validation/unique.email.decorator';
import { IsLoginUnique } from '../../validation/unique.login.decorator';

@Injectable()
export class RegistrationUserDTO {
  @Prop()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(10)
  @Matches('^[a-zA-Z0-9_-]*$')
  @IsLoginUnique({ message: 'User with this username already exists' })
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
  @IsEmailUnique({ message: 'User with this email already exists' })
  email: string;
}
