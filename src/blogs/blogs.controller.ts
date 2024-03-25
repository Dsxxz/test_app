import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { BlogCreateDto } from './models/blogs.model.dto';
import { BlogService } from './blogs.service';
import { BlogsViewModel } from './models/blogs.view.model';
import { PostService } from '../posts/posts.service';
import { getPageInfo, InputQueryDto } from '../pagination/input.query.dto';
import { Paginator } from '../pagination/paginator';

@Controller('/blogs')
export class BlogsController {
  constructor(
    private blogService: BlogService,
    private postService: PostService,
  ) {}

  @Get(':id')
  async findOneBlog(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }
  @Get()
  async findAllBlogs(@Query() dto: InputQueryDto) {
    const pageInfo = getPageInfo(dto);

    const blogs = await this.blogService.findByQuery(pageInfo as InputQueryDto);
    if (!blogs) {
      return Paginator.get({
        pageNumber: pageInfo.pageNumber,
        pageSize: pageInfo.pageSize,
        totalCount: 0,
        items: [],
      });
    }

    return Paginator.get({
      pageNumber: pageInfo.pageNumber,
      pageSize: pageInfo.pageSize,
      totalCount: blogs.length | 0,
      items: blogs,
    });
  }
  @Post()
  async createBlog(@Body() dto: BlogCreateDto): Promise<BlogsViewModel> {
    return this.blogService.createBlog(dto);
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param('id') id: string,
    @Body() dto: BlogCreateDto,
    @Res() res: Response,
  ) {
    const blog = await this.blogService.findBlogById(id);
    if (!blog) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    await this.blogService.updateBlog(id, dto);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteBlog(@Param('id') id: string, @Res() res: Response) {
    const blog = await this.blogService.findBlogById(id);
    if (!blog) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    await this.blogService.deleteBlog(id);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Post(':id/posts')
  async createPostForBlog(
    @Param('id') id: string,
    @Body() dto: any,
    @Res() res: Response,
  ) {
    console.log(1);
    const foundBlog = await this.blogService.findBlogById(id);
    if (!foundBlog) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send([{ message: 'Blog must exist', field: 'blogId' }]);
    }
    const a = await this.postService.createPost({ ...dto, blogId: id });
    return res.send(a);
  }

  @Get(':id/posts')
  async findPostsForBlog(@Param('id') id: string, @Res() res: Response) {
    const blog = await this.blogService.findBlogById(id);
    const posts = await this.postService.findPostsForBlogBiId(id);
    if (!blog) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    return res.status(HttpStatus.OK).send(posts);
  }
}
