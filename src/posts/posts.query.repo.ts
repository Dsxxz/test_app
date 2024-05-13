import { Inject, Injectable } from '@nestjs/common';
import { InputQueryDto, QueryPostDto } from '../pagination/input.query.dto';
import { PostRepository } from './posts.repository';
import { PostModel } from './models/posts.model';
import { PostViewModel } from './models/post.view.model';
import { PostsModelDto } from './models/posts.model.dto';

@Injectable()
export class PostQueryRepo {
  constructor(
    @Inject(PostRepository) private readonly postRepository: PostRepository,
  ) {}
  async findByQuery(
    dto: InputQueryDto,
    blogId?: string,
  ): Promise<PostViewModel[] | []> {
    const posts = await this.postRepository.findByQuery(dto, blogId);
    if (!posts) return [];
    return this.postRepository.convertToViewModel(posts);
  }

  convertToViewPagination(
    dto: QueryPostDto,
    items: PostViewModel | PostViewModel[],
  ) {
    return this.postRepository.convertToViewPagination(dto, items);
  }

  async getPageInfo(dto: InputQueryDto): Promise<QueryPostDto> {
    return await this.postRepository.getPageInfo(dto);
  }

  convertToViewModel(posts: PostsModelDto[]) {
    return this.postRepository.convertToViewModel(posts as PostModel[]);
  }
}
