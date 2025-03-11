import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DataBaseService } from './dbService/data.base.service';
import { AuthModule } from './features/auth/auth.module';
import { mongoData } from './core/settings/mongoData/mongo.data';
import { MailModule } from './infrastructure/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './core/settings/configuration';
import { validate } from 'class-validator';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogService } from './features/blogs/application/blogs.service';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { models } from './dbService/models.index';
import { UsersController } from './features/users/api/users.controller';
import { PostsController } from './features/posts/api/posts.controller';
import { BlogQueryRepo } from './features/blogs/infrastructure/blog.query.repo';
import { PostService } from './features/posts/application/posts.service';
import { PostQueryRepo } from './features/posts/infrastructure/posts.query.repo';
import { PostRepository } from './features/posts/infrastructure/posts.repository';
import { CommentService } from './features/comments/application/comment.service';
import { CommentsRepository } from './features/comments/infrastructure/comments.repository';
import { LikesService } from './features/likes/application/likes.service';
import { LikesRepository } from './features/likes/infrastructure/likes.repository';
import { UserQueryRepository } from "./features/users/infrastructure/users.query-repository";

const mongoUri = mongoData.mongoRemote || mongoData.mongoLocal;

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, { dbName: 'nest' }),
    MongooseModule.forFeature(models),
    AuthModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
  ],
  controllers: [
    AppController,
    BlogsController,
    UsersController,
    PostsController,
  ],
  providers: [
    AppService,
    DataBaseService,
    BlogService,
    BlogsRepository,
    BlogQueryRepo,
    PostService,
    PostQueryRepo,
    PostRepository,
    CommentService,
    CommentsRepository,
    LikesService,
    LikesRepository,
    UserQueryRepository
  ],
})
export class AppModule {}
