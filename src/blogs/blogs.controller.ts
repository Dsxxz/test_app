import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BlogCreateDto } from './models/blogs.model.dto';
import { BlogService } from './blogs.service';
import { BlogsViewModel } from './models/blogs.view.model';
import { PostsModelDto } from '../posts/models/posts.model.dto';
import { PostService } from '../posts/posts.service';
import { PostViewModel } from '../posts/models/post.view.model';

@Controller('api/blogs')
export class BlogsController {
  constructor(
    private blogService: BlogService,
    private postService: PostService,
  ) {}

  @Get()
  async findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  async findOneBlog(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Post()
  async createBlog(@Body() dto: BlogCreateDto): Promise<BlogsViewModel> {
    return this.blogService.createBlog(dto);
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(@Param('id') id: string, @Body() dto: BlogCreateDto) {
    return this.blogService.updateBlog(id, dto);
  }

  @Delete(':id')
  async deleteBlog(@Param('id') id: string) {
    return id;
  }

  @Post(':id/posts')
  async createPostForBlog(@Param('id') id: string, @Body() dto: any) {
    const foundBlog = this.blogService.findBlogById(id);
    if (!foundBlog) throw new Error('Blog must exist');
    return this.postService.createPost({ ...dto, blogId: id } as PostsModelDto);
  }

  @Get(':id/posts')
  async findPostsForBlog(@Param('id') id: string): Promise<any | null> {
    return this.postService.findPostsForBlogBiId(id);
  }
}
