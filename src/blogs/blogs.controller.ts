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
} from '@nestjs/common';
import { BlogCreateDto } from './models/blogs.model.dto';
import { BlogService } from './blogs.service';
import { BlogsViewModel } from './models/blogs.view.model';
import { PostsModelDto } from '../posts/models/posts.model.dto';
import { PostService } from '../posts/posts.service';
import { InputQueryDto } from '../pagination/input.query.dto';
import { Paginator } from '../pagination/paginator';
import { EnumDirection } from '../pagination/enum.direction';

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
    let { pageNumber, pageSize, sortBy, sortDirection } = dto;

    if (!dto.pageNumber) pageNumber = 1;
    if (!dto.pageSize) pageSize = 10;
    if (!dto.sortBy) sortBy = 'createdAt';
    if (!dto.sortDirection) sortDirection = EnumDirection.desc;

    const blogs = await this.blogService.findByQuery({
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    });
    console.log(blogs);
    if (!blogs) {
      return HttpStatus.NOT_FOUND;
    }
    const result = blogs.map((el) => {
      return {
        ...el,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [
            {
              addedAt: '2024-03-24T10:19:08.848Z',
              userId: 'string',
              login: 'string',
            },
          ],
        },
      };
    });
    return Paginator.get({
      pageNumber: dto.pageNumber,
      pageSize: dto.pageSize,
      totalCount: result.length | 0,
      items: result,
    });
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
