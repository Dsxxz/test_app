import { Inject, Injectable } from '@nestjs/common';
import { InputQueryDto } from '../pagination/input.query.dto';
import { PostRepository } from './posts.repository';

@Injectable()
export class PostQueryRepo {
  constructor(
    @Inject(PostRepository) private readonly postRepository: PostRepository,
  ) {}
  async findByQuery(dto: InputQueryDto, blogId?: string) {
    const posts = await this.postRepository.findByQuery(dto, blogId);
    if (!posts) return [];
    return posts.map((post) => {
      return this.postRepository.convertToViewModel(post);
    });
  }
}
