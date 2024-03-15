import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class PostsModelDto {
  @Prop()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  title: string;
  @Prop()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  shortDescription: string;
  @Prop()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  content: string;
  @Prop()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  blogId: string;
}
