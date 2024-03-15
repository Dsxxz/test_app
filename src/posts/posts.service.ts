import { Inject, Injectable } from '@nestjs/common';
import { PostRepository } from './posts.repository';
import { PostsModelDto } from './posts.model.dto';

@Injectable()
export class PostService {
  constructor(
    @Inject(PostRepository) private readonly postRepository: PostRepository,
  ) {}
  async findPostById(id: string) {
    return this.postRepository.findPostById(id);
  }

  async findAllPosts() {
    return this.postRepository.findAllPosts();
  }

  async createPost(dto: PostsModelDto) {
    return this.postRepository.createPost(dto);
  }

  async updatePost(id: string, dto: Partial<PostsModelDto>) {
    return this.postRepository.updatePost(id, dto);
  }
}
