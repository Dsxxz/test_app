import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PostDocument, PostModel } from './models/posts.model';
import { PostsModelDto } from './models/posts.model.dto';
import { EnumDirection } from '../pagination/enum.direction';
import { InputQueryDto } from '../pagination/input.query.dto';
import { PostViewModel } from './models/post.view.model';
import { LikeEnum } from '../likes/likes_models/likes.enum.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(PostModel.name) private postModel: Model<PostDocument>,
  ) {}

  async findPostById(id: string): Promise<PostDocument | null> {
    return this.postModel.findOne({ _id: id });
  }

  async findAllPosts(): Promise<PostModel[]> {
    return this.postModel.find();
  }

  async createPost(dto: PostsModelDto, blogName: string): Promise<PostModel> {
    const post = new this.postModel(dto);
    post.createdAt = new Date().toISOString();
    post.id = post._id.toString();
    post.blogName = blogName;
    post.blogId = dto.blogId;
    return await post.save();
  }

  async updatePost(id: ObjectId, dto: Partial<PostsModelDto>): Promise<void> {
    const existingPost = await this.postModel.findById({ _id: id });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    if (dto.title) existingPost.title = dto.title;
    if (dto.shortDescription)
      existingPost.shortDescription = dto.shortDescription;
    if (dto.content) existingPost.content = dto.content;

    return this.savePost(existingPost);
  }
  async savePost(post: PostDocument) {
    await post.save();
  }

  async findPostsForBlogBiId(blogId: string): Promise<PostViewModel[] | null> {
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
              myStatus: LikeEnum.None,
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

  async findByQueryForOneBlog(blogId: string, dto: InputQueryDto) {
    const sd = dto.sortDirection === EnumDirection.asc ? 1 : -1;
    return this.postModel
      .find({ blogId: blogId })
      .sort({ [dto.sortBy]: sd })
      .skip((dto.pageNumber - 1) * dto.pageSize)
      .limit(dto.pageSize)
      .lean();
  }
}
