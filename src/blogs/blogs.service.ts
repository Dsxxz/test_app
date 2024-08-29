import { Inject, Injectable } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { BlogCreateDto } from './models/blogs.model.dto';
import { BlogsViewModel } from './models/blogs.view.model';
import { ObjectId } from 'mongodb';
import { BlogDocument } from './models/blogs.model';

@Injectable()
export class BlogService {
  constructor(
    @Inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
  ) {}

  async findAll() {
    return this.blogsRepository.findAll();
  }

  async findOne(id: string) {
    return this.blogsRepository.findOne(new ObjectId(id));
  }

  async createBlog(dto: BlogCreateDto): Promise<BlogsViewModel> {
    return this.blogsRepository.createBlog(dto);
  }

  async updateBlog(id: string, dto: Partial<BlogCreateDto>) {
    return this.blogsRepository.updateBlog(id, dto);
  }

  async findBlogById(id: string): Promise<BlogDocument | null> {
    return this.blogsRepository.findBlogById(new ObjectId(id));
  }

  async deleteBlog(id: string) {
    return this.blogsRepository.deleteBlog(new ObjectId(id));
  }

  async getTotalCount(searchNameTerm?: string) {
    return this.blogsRepository.getTotalCount(searchNameTerm);
  }
}
