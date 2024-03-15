import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BlogCreateDto } from './models/blogs.model.dto';
import { BlogService } from './blogs.service';

@Controller('api/blogs')
export class BlogsController {
  constructor(private blogService: BlogService) {}

  @Get()
  async findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  async findOneBlog(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Post()
  async createBlog(@Body() dto: BlogCreateDto) {
    return this.blogService.createBlog(dto);
  }

  @Put(':id')
  async updateBlog(
    @Param('id') id: string,
    @Body() dto: Partial<BlogCreateDto>,
  ) {
    return this.blogService.updateBlog(id, dto);
  }

  @Delete(':id')
  async deleteBlog(@Param('id') id: string) {
    return id;
  }
}
