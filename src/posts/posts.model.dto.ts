import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import mongoose from 'mongoose';
import { BlogModel } from '../blogs/models/blogs.model';

export class PostsModelDto {
  @Prop()
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  title: string;
  @Prop()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  shortDescription: string;
  @Prop()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: BlogModel.name })
  blogId: string;
}
