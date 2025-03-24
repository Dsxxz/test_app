import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { LikeEnum } from '../../dto/likes.enum.model';
import { NewLikeModel, NewLikeSchema } from "../../dto/newLike.type";

@Schema()
export class LikePostInfoType {
  @Prop([String])
  likesCount: string[];
  @Prop([String])
  dislikeCount: string[];
  @Prop({ type: String, default: LikeEnum.None })
  myStatus: string;
  @Prop({type: [NewLikeSchema], required: true})
  newestLikes:NewLikeModel[]
}

export const LikeInfoSchema = SchemaFactory.createForClass(LikePostInfoType);
