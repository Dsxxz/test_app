import { HydratedDocument } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

export type LikeDocument = HydratedDocument<LikeModel>;

export class LikeModel {
  @Prop()
  addedAt: string;
  @Prop()
  userId: string;
  @Prop()
  login: string;
  @Prop()
  commentId: string;
}

export const LikeSchema = SchemaFactory.createForClass(LikeModel);
