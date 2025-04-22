import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class BlogCreateDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(15)
  @Transform(({ value }) => value.trim())
  name: string;
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(500)
  @Transform(({ value }) => value.trim())

  description: string;
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100)
  @Matches(
    '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$',
  )
  @Transform(({ value }) => value.trim())
  websiteUrl: string;
}
