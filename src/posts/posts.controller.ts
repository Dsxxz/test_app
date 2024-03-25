import {
  Body,
  Controller,
  Get,
  Query,
  HttpCode,
  Param,
  Post,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from './posts.service';
import { PostsModelDto } from './models/posts.model.dto';
import { getPageInfo, InputQueryDto } from '../pagination/input.query.dto';
import { Paginator } from '../pagination/paginator';

@Controller('/posts')
export class PostsController {
  constructor(protected postService: PostService) {}

  @Get(':id')
  async getOnePost(@Param('id') id: string) {
    return this.postService.findPostById(id);
  }

  @Get()
  async findAllPosts(@Query() dto: InputQueryDto) {
    const pageInfo = getPageInfo(dto);
    const posts = await this.postService.findByQuery(pageInfo as InputQueryDto);
    if (!posts) {
      return Paginator.get({
        pageNumber: dto.pageNumber,
        pageSize: dto.pageSize,
        totalCount: 0,
        items: [],
      });
    }
    const result = posts.map((el) => {
      return {
        ...el,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      };
    });
    return Paginator.get({
      pageNumber: pageInfo.pageNumber,
      pageSize: pageInfo.pageSize,
      totalCount: result.length | 0,
      items: result,
    });
  }

  @Post()
  async createPostForBlog(@Body() dto: PostsModelDto) {
    return this.postService.createPost(dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() dto: Partial<PostsModelDto>,
  ) {
    return this.postService.updatePost(id, dto);
  }
  @HttpCode(404)
  @Get(':id/comments')
  async getCommentsForPostById() {
    return;
  }
}
