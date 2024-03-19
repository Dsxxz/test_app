import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeInfoModel } from '../../likes/likes_models/likes.info.model';

export type PostDocument = HydratedDocument<PostModel>;
@Schema()
export class PostModel {
  @Prop()
  id: string = '1';

  @Prop()
  title: string;

  @Prop()
  shortDescription: string;

  @Prop()
  content: string;

  @Prop()
  BlogId: string = '1';

  @Prop()
  BlogName: string = '1';

  @Prop()
  CreatedAt: string = '1';

  @Prop({ type: LikeInfoModel })
  ExtendedLikesInfo: LikeInfoModel = {
    likesCount: [],
    dislikeCount: [],
    myStatus: 'None',
    newestLikes: [],
  };
}

export const PostSchema = SchemaFactory.createForClass(PostModel);
