import { Inject, Injectable } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { BlogCreateDto } from './models/blogs.model.dto';

@Injectable()
export class BlogService {
  constructor(
    @Inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
  ) {}

  async findAll() {
    return this.blogsRepository.findAll();
  }

  async findOne(id: string) {
    return this.blogsRepository.findOne(id);
  }

  async createBlog(dto: BlogCreateDto) {
    return this.blogsRepository.createBlog(dto);
  }

  async updateBlog(id: string, dto: Partial<BlogCreateDto>) {
    return this.blogsRepository.updateBlog(id, dto);
  }
}
