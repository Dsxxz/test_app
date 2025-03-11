import { Injectable } from '@nestjs/common';
import { Prop } from '@nestjs/mongoose';
import { IsString, MaxLength, MinLength } from 'class-validator';

@Injectable()
export class CommentCreateDTO {
  @Prop()
  @IsString()
  @MinLength(20)
  @MaxLength(300)
  content: string;
}
