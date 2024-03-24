import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<BlogModel>;
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
}

export const BlogSchema = SchemaFactory.createForClass(BlogModel);
