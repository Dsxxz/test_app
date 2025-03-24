import { UserModel, UserSchema } from '../features/users/domain/users.entity';
import { BlogModel, BlogSchema } from '../features/blogs/domain/blogs.entity';
import { PostModel, PostSchema } from '../features/posts/domain/posts.entity';
import {
  CommentModel,
  CommentSchema,
} from '../features/comments/domain/comment.entity';
import { LikeInfoSchema, LikePostInfoType } from "../features/likes/api/input-dto/likes.info.model";

export const models = [
  { name: UserModel.name, schema: UserSchema },
  { name: BlogModel.name, schema: BlogSchema },
  { name: PostModel.name, schema: PostSchema },
  { name: LikePostInfoType.name, schema: LikeInfoSchema },
  { name: CommentModel.name, schema: CommentSchema },
];
