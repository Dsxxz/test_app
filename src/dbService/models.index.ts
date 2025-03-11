import { UserModel, UserSchema } from '../features/users/domain/users.entity';
import { BlogModel, BlogSchema } from '../features/blogs/domain/blogs.model';
import { PostModel, PostSchema } from '../features/posts/domain/posts.model';
import { LikeModel, LikeSchema } from '../features/likes/domain/likes.model';
import {
  CommentModel,
  CommentSchema,
} from '../features/comments/domain/comments.model';

export const models = [
  { name: UserModel.name, schema: UserSchema },
  { name: BlogModel.name, schema: BlogSchema },
  { name: PostModel.name, schema: PostSchema },
  { name: LikeModel.name, schema: LikeSchema },
  { name: CommentModel.name, schema: CommentSchema },
];
