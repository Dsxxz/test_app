import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserModel } from '../../users/models/users.model';

export type BlogDocument = HydratedDocument<BlogModel>;
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
  @Prop({ default: false })
  isMembership: boolean;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: UserModel.name })
  owner: UserModel;
}

export const BlogSchema = SchemaFactory.createForClass(BlogModel);
