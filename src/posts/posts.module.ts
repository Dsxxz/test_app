import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModel, PostSchema } from './models/posts.model';
import { PostsController } from './posts.controller';
import { PostService } from './posts.service';
import { PostRepository } from './posts.repository';
import { BlogsModule } from '../blogs/blogs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PostModel.name, schema: PostSchema }]),
    forwardRef(() => BlogsModule),
  ],
  controllers: [PostsController],
  providers: [PostService, PostRepository],
  exports: [PostService, PostRepository],
})
export class PostsModule {}
