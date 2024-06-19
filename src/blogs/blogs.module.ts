import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModel, BlogSchema } from './models/blogs.model';
import { BlogsRepository } from './blogs.repository';
import { BlogService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { PostsModule } from '../posts/posts.module';
import { BlogQueryRepo } from './blog.query.repo';
import { PostQueryRepo } from '../posts/posts.query.repo';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BlogModel.name,
        schema: BlogSchema,
      },
    ]),
    forwardRef(() => PostsModule),
  ],
  controllers: [BlogsController],
  providers: [BlogsRepository, BlogService, BlogQueryRepo, PostQueryRepo],
  exports: [BlogsRepository, BlogService, BlogQueryRepo, PostQueryRepo],
})
export class BlogsModule {}
