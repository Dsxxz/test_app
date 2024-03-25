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
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PostService } from './posts.service';
import { PostsModelDto } from './models/posts.model.dto';
import { getPageInfo, InputQueryDto } from '../pagination/input.query.dto';
import { Paginator } from '../pagination/paginator';
import { BlogService } from '../blogs/blogs.service';

@Controller('/posts')
export class PostsController {
  constructor(
    protected postService: PostService,
    protected blogService: BlogService,
  ) {}

  @Get(':id')
  async getOnePost(@Param('id') id: string) {
    return this.postService.findPostById(id);
  }

  @Get()
  async findAllPosts(@Query() dto: InputQueryDto) {
    const pageInfo = getPageInfo(dto);
    const totalCount = await this.postService.getTotalCount();
    const posts = await this.postService.findByQuery(pageInfo as InputQueryDto);
    if (!posts) {
      return Paginator.get({
        pageNumber: +dto.pageNumber,
        pageSize: +dto.pageSize,
        totalCount: +totalCount,
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
      pageNumber: +pageInfo.pageNumber,
      pageSize: +pageInfo.pageSize,
      totalCount: +totalCount,
      items: result,
    });
  }

  @Post()
  async createPostForBlog(@Body() dto: PostsModelDto, @Res() res: Response) {
    const foundBlog = await this.blogService.findBlogById(dto.blogId);
    if (!foundBlog) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send([{ message: 'Blog must exist', field: 'blogId' }]);
    }
    const post = await this.postService.createPost({
      ...dto,
      blogId: dto.blogId,
    });
    return res.send(post);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() dto: Partial<PostsModelDto>,
    @Res() res: Response,
  ) {
    const post = await this.postService.findPostById(id);
    if (!post) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    await this.postService.updatePost(id, dto);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string, @Res() res: Response) {
    const post = await this.postService.findPostById(id);
    if (!post) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    await this.postService.deletePost(id);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @HttpCode(404)
  @Get(':id/comments')
  async getCommentsForPostById() {
    return;
  }
}
