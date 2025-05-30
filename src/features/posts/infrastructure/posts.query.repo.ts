import { Inject, Injectable } from '@nestjs/common';
import {
  PaginationQueryDto,
  QueryPostDto,
} from '../../../core/dto/pagination/paginationQueryDto';
import { PostRepository } from './posts.repository';
import { PostModel } from '../domain/posts.entity';
import { PostViewModel } from '../api/view-dto/post.view.model';
import { PostsModelDto } from '../dto/posts.model.dto';

@Injectable()
export class PostQueryRepo {
  constructor(
    @Inject(PostRepository) private readonly postRepository: PostRepository,
  ) {}
  async findByQuery(
    dto: PaginationQueryDto,
    blogId?: string,
  ): Promise<PostViewModel[]> {
    const posts = await this.postRepository.findByQuery(dto, blogId);
    if (!posts) return [];
    return this.convertToViewModel(posts as PostModel[]);
  }

  async convertToViewPagination(
    dto: QueryPostDto,
    items: PostViewModel | PostViewModel[],
  ) {
    return this.postRepository.convertToViewPagination(dto, items);
  }

  async getPageInfo(dto: PaginationQueryDto): Promise<QueryPostDto> {
    return await this.postRepository.getPageInfo(dto);
  }

  convertToViewModel(posts: PostsModelDto[]) {
    return this.postRepository.convertToViewModel(posts as PostModel[]);
  }
}
