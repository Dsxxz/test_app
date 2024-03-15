import { HydratedDocument } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { LikeEnum } from './likes.enum.model';
import { LikeModel } from './likes.model';

export type LikesDocument = HydratedDocument<LikeInfoModel>;

export class LikeInfoModel {
  @Prop([String])
  likesCount: string[];
  @Prop([String])
  dislikeCount: string[];
  @Prop({ type: LikeEnum })
  myStatus: string;
  @Prop({ type: LikeModel })
  newestLikes: LikeModel[];
}

export const LikeInfoSchema = SchemaFactory.createForClass(LikeInfoModel);
