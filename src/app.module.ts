import { ConfigModule } from '@nestjs/config';
const configModule = ConfigModule.forRoot();
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DataBaseService } from './dbService/data.base.service';

import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';

const mongoUri = process.env.MONGO_URL
  ? process.env.MONGO_URL
  : 'mongodb://127.0.0.1:27017/test_api';

@Module({
  imports: [
    configModule,
    MongooseModule.forRoot(mongoUri, { dbName: 'nest' }),
    UsersModule,
    BlogsModule,
    PostsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataBaseService],
})
export class AppModule {}
