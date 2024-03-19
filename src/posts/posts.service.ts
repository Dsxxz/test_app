import { Inject, Injectable } from '@nestjs/common';
import { PostRepository } from './posts.repository';
import { PostsModelDto } from './models/posts.model.dto';
import { BlogService } from '../blogs/blogs.service';

@Injectable()
export class PostService {
  constructor(
    @Inject(PostRepository) private readonly postRepository: PostRepository,
    protected blogService: BlogService,
  ) {}
  async findPostById(id: string) {
    return this.postRepository.findPostById(id);
  }

  async findAllPosts() {
    return this.postRepository.findAllPosts();
  }

  async createPost(dto: PostsModelDto) {
    const blog = await this.blogService.findBlogById(dto.blogId);
    if (!blog) throw new Error('Blog must exist');
    const post = await this.postRepository.createPost(dto, blog.name);
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  async updatePost(id: string, dto: PostsModelDto) {
    return this.postRepository.updatePost(id, dto);
  }

  async findPostsForBlogBiId(id: string): Promise<any | null> {
    return this.postRepository.findPostsForBlogBiId(id);
  }
}
