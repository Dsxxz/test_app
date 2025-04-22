import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LikePostInfoType } from '../../likes/dto/input-dto/likes.info.model';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
export type commentDocument = HydratedDocument<CommentModel>;
export class CommentatorInfoType {
  @IsString()
  userId: string;

  @IsString()
  userLogin: string;
}
@Schema()
export class CommentModel {
  @Prop()
  content: string;
  @Prop({ type: Object, required: true })
  @Type(() => CommentatorInfoType)
  commentatorInfo: CommentatorInfoType;
  @Prop()
  createdAt: string;
  @Prop()
  likesInfo: LikePostInfoType;
}

export const CommentSchema = SchemaFactory.createForClass(CommentModel);
