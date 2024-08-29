import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './user.repository';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './models/users.model';
import {
  CommentInfoSchema,
  CommentModel,
} from '../comments/models/comments.model';
import { CommentsController } from '../comments/comments.controller';
import { CommentsRepository } from '../comments/comments.repository';
import { CommentService } from '../comments/comment.service';
import { LikesService } from '../likes/likes.service';
import { LikesRepository } from '../likes/likes.repository';
import { LikeModel } from '../likes/likes_models/likes.model';
import { LikeInfoSchema } from '../likes/likes_models/likes.info.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema },
      { name: CommentModel.name, schema: CommentInfoSchema },
      { name: LikeModel.name, schema: LikeInfoSchema },
    ]),
  ],
  controllers: [UsersController, CommentsController],
  providers: [
    UsersService,
    UsersRepository,
    CommentsRepository,
    CommentService,
    LikesService,
    LikesRepository,
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
