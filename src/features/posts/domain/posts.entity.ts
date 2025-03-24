import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { LikePostInfoType } from "../../likes/api/input-dto/likes.info.model";

export type PostDocument = HydratedDocument<PostModel>;
@Schema()
export class PostModel  {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  shortDescription: string;

  @Prop()
  content: string;

  @Prop()
  blogId: string;

  @Prop()
  blogName: string;

  @Prop()
  createdAt: string;

  @Prop({type: LikePostInfoType, required: true})
  extendedLikesInfo: LikePostInfoType
}

export const PostSchema = SchemaFactory.createForClass(PostModel);
PostSchema.loadClass(PostModel);
