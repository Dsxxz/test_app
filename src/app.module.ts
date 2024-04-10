import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts/posts.controller';
import { DataBaseService } from './dbService/data.base.service';

import * as dotenv from 'dotenv';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
dotenv.config();

const mongoUri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/test_api';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, { dbName: 'nest' }),
    UsersModule,
    BlogsModule,
    PostsModule,
  ],
  controllers: [AppController, PostsController],
  providers: [AppService, DataBaseService],
})
export class AppModule {}
