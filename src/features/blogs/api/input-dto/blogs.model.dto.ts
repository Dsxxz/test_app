import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class BlogCreateDto {
  @Prop()
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @Transform(({ value }) => value.trim())
  name: string;
  @Prop()
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;
  @Prop()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Matches(
    '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$',
  )
  websiteUrl: string;
}
