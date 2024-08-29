import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModel, PostSchema } from './models/posts.model';
import { PostsController } from './posts.controller';
import { PostService } from './posts.service';
import { PostRepository } from './posts.repository';
import { BlogsModule } from '../blogs/blogs.module';
import { CommentService } from '../comments/comment.service';
import { CommentsRepository } from '../comments/comments.repository';
import {
  CommentInfoSchema,
  CommentModel,
} from '../comments/models/comments.model';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/user.repository';
import { UserModel, UserSchema } from '../users/models/users.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostModel.name, schema: PostSchema },
      { name: CommentModel.name, schema: CommentInfoSchema },
      { name: UserModel.name, schema: UserSchema },
    ]),
    forwardRef(() => BlogsModule),
  ],
  controllers: [PostsController],
  providers: [
    PostService,
    PostRepository,
    CommentService,
    CommentsRepository,
    UsersService,
    UsersRepository,
  ],
  exports: [PostService, PostRepository],
})
export class PostsModule {}
