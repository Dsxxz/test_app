import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PostDocument, PostModel } from './models/posts.model';
import { PostsModelDto } from './models/posts.model.dto';
import { EnumDirection } from '../pagination/enum.direction';
import { InputQueryDto } from '../pagination/input.query.dto';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(PostModel.name) private postModel: Model<PostDocument>,
  ) {}

  async findPostById(id: string): Promise<PostDocument | null> {
    return this.postModel.findOne({ id: id });
  }

  async findAllPosts(): Promise<PostModel[]> {
    return this.postModel.find();
  }

  async createPost(dto: PostsModelDto, blogName: string): Promise<PostModel> {
    const post = new this.postModel(dto);
    post.createdAt = new Date().toISOString();
    post.id = post._id.toString();
    post.blogName = blogName;
    return post.save();
  }

  async updatePost(id: string, dto: PostsModelDto): Promise<void> {
    const existingPost = await this.postModel.findById(id);

    if (!existingPost) {
      throw new Error('Blog not found');
    }

    existingPost.title = dto.title;
    existingPost.shortDescription = dto.shortDescription;
    existingPost.content = dto.content;

    return this.savePost(existingPost);
  }
  async savePost(post: PostDocument) {
    await post.save();
  }

  async findPostsForBlogBiId(blogId: string): Promise<any | null> {
    const posts = await this.postModel.find({ blogId: blogId });
    return posts
      ? posts.map((post) => {
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
        })
      : null;
  }

  async findByQuery(dto: InputQueryDto) {
    const sd = dto.sortDirection === EnumDirection.asc ? 1 : -1;
    return this.postModel
      .find()
      .sort({ [dto.sortBy]: sd })
      .skip((dto.pageNumber - 1) * dto.pageSize)
      .limit(dto.pageSize)
      .lean();
  }
}
