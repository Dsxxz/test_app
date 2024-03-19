import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PostService } from './posts.service';
import { PostsModelDto } from './posts.model.dto';

@Controller('api/posts')
export class PostsController {
  constructor(protected postService: PostService) {}

  @Get(':id')
  async getOnePost(@Param('id') id: string) {
    return this.postService.findPostById(id);
  }

  @Get()
  async findAllPosts() {
    return this.postService.findAllPosts();
  }

  @Post()
  async createPostForBlog(@Body() dto: PostsModelDto) {
    return this.postService.createPost(dto);
  }
  @Put()
  async updatePost(
    @Param('id') id: string,
    @Body() dto: Partial<PostsModelDto>,
  ) {
    return this.postService.updatePost(id, dto);
  }
}
