import { Inject, Injectable } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { InputQueryDto } from '../helpers/pagination/input.query.dto';
import { BlogsViewModel } from './models/blogs.view.model';

@Injectable()
export class BlogQueryRepo {
  constructor(
    @Inject(BlogsRepository) private readonly blogRepository: BlogsRepository,
  ) {}
  async findByQuery(dto: InputQueryDto): Promise<BlogsViewModel[]> {
    const blogs = await this.blogRepository.findByQuery(dto);
    return blogs.map((el) => {
      return this.blogRepository.convertToViewModel(el);
    });
  }
}
