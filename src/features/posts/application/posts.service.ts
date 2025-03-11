import { Inject, Injectable } from '@nestjs/common';
import { PostRepository } from '../infrastructure/posts.repository';
import { PostsModelDto } from '../dto/posts.model.dto';
import { BlogService } from '../../blogs/application/blogs.service';
import { PostViewModel } from '../api/view-dto/post.view.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostService {
  constructor(
    @Inject(PostRepository) private readonly postRepository: PostRepository,
    @Inject(BlogService) protected blogService: BlogService,
  ) {}
  async findPostById(id: string) {
    const post = await this.postRepository.findPostById(new ObjectId(id));
    if (!post) return null;
    return this.postRepository.convertToViewModel([post]);
  }

  async createPost(dto: PostsModelDto): Promise<PostViewModel> {
    const blog = await this.blogService.findBlogById(dto.blogId);
    if (!blog) {
      throw new Error('Blog must exist');
    }
    const post = await this.postRepository.createPost(dto, blog.name);
    return this.postRepository.convertToViewModelUtility(post);
  }

  async updatePost(id: string, dto: Partial<PostsModelDto>) {
    return this.postRepository.updatePost(new ObjectId(id), dto);
  }

  async getTotalCount(blogId?: string) {
    return this.postRepository.getTotalCount(blogId);
  }

  async deletePost(id: string) {
    return this.postRepository.deletePost(new ObjectId(id));
  }
}
