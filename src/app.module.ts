import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModel, BlogSchema } from './blogs/models/blogs.model';
import { BlogsController } from './blogs/blogs.controller';
import { BlogService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/blogs.repository';
import { PostsController } from './posts/posts.controller';
import { PostService } from './posts/posts.service';
import { PostRepository } from './posts/posts.repository';
import { PostModel, PostSchema } from './posts/models/posts.model';
import { DataBaseService } from './dbService/data.base.service';

import * as dotenv from 'dotenv';
import { UsersModule } from './users/users.module';
dotenv.config();

const mongoUri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/test_api';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, { dbName: 'nest' }),
    MongooseModule.forFeature([
      { name: BlogModel.name, schema: BlogSchema },
      { name: PostModel.name, schema: PostSchema },
    ]),
    UsersModule,
  ],
  controllers: [AppController, BlogsController, PostsController],
  providers: [
    AppService,
    BlogService,
    BlogsRepository,
    PostService,
    PostRepository,
    DataBaseService,
  ],
})
export class AppModule {}
