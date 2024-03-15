import { HydratedDocument, Schema } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { LikeInfoModel } from '../../likes/likes_models/likes.info.model';
import { BlogModel } from '../../blogs/models/blogs.model';

export type PostDocument = HydratedDocument<PostModel>;

export class PostModel {
  @Prop()
  id: string = '1';

  @Prop()
  title: string;

  @Prop()
  shortDescription: string;

  @Prop()
  content: string;

  @Prop({ ref: BlogModel.name })
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

export const PostSchema: Schema<PostModel> =
  SchemaFactory.createForClass(PostModel);
