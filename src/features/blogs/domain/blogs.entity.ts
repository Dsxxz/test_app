import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BlogCreateDto } from '../api/input-dto/blogs.model.dto';
import { BlogDocument } from '../dto/blog.type';

@Schema()
export class BlogModel {
  @Prop()
  id: string;
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  websiteUrl: string;
  @Prop()
  createdAt: string;
  @Prop({ default: true })
  isMembership: boolean;

  static async createInstance(dto: BlogCreateDto) {
    const blog = new this();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.createdAt = new Date().toISOString();
    blog.isMembership = false;

    return blog as BlogDocument;
  }
}

//registration schema
export const BlogSchema = SchemaFactory.createForClass(BlogModel);

//registration methods in schema
BlogSchema.loadClass(BlogModel);
