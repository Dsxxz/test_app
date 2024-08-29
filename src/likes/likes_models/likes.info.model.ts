import { HydratedDocument } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { LikeEnum } from './likes.enum.model';

export type LikesDocument = HydratedDocument<LikePostInfoType>;

export class LikePostInfoType {
  @Prop([String])
  likesCount: string[];
  @Prop([String])
  dislikeCount: string[];
  @Prop({ type: LikeEnum })
  myStatus: string;
}

export const LikeInfoSchema = SchemaFactory.createForClass(LikePostInfoType);
