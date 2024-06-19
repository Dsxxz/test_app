import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DataBaseService } from './dbService/data.base.service';

import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { mongoData } from './settings/mongoData/mongo.data';
import { MailModule } from './infrastructure/mail/mail.module';

const mongoUri = mongoData.mongoRemote || mongoData.mongoLocal;

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, { dbName: 'nest' }),
    UsersModule,
    BlogsModule,
    PostsModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataBaseService],
})
export class AppModule {}
