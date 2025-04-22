import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NewLikeModel, NewLikeSchema } from "../newLike.type";

@Schema()
export class LikePostInfoType {
  @Prop([String])
  likesCount: string[];
  @Prop([String])
  dislikeCount: string[];
  @Prop({type: [NewLikeSchema], required: true})
  newestLikes:NewLikeModel[]
}

export const LikeInfoSchema = SchemaFactory.createForClass(LikePostInfoType);
//todo: change naming: files, folders, entities/models;