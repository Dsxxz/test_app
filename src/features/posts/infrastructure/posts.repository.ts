import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PostDocument, PostModel } from '../domain/posts.model';
import { PostsModelDto } from '../dto/posts.model.dto';
import { EnumDirection } from '../../../core/dto/pagination/enum.direction';
import {
  getPageInfo,
  InputQueryDto,
  QueryPostDto,
} from '../../../core/dto/pagination/input.query.dto';
import { PostViewModel } from '../api/view-dto/post.view.model';
import { LikeEnum } from '../../likes/dto/likes.enum.model';
import { ObjectId } from 'mongodb';
import { Paginator } from '../../../core/dto/pagination/paginator';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(PostModel.name) private postModel: Model<PostDocument>,
  ) {}

  async findPostById(_id: ObjectId): Promise<PostDocument | null> {
    return this.postModel.findOne({ _id });
  }

  async createPost(dto: PostsModelDto, blogName: string): Promise<PostModel> {
    const post = new this.postModel(dto);
    post.createdAt = new Date().toISOString();
    post.id = post._id.toString();
    post.blogName = blogName;
    post.blogId = dto.blogId;
    return await this.savePost(post);
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

    await this.savePost(existingPost);
    return;
  }
  async savePost(post: PostDocument) {
    await post.save();
    return post;
  }

  async getTotalCount(blogId?: string) {
    const filter = blogId ? { blogId: blogId } : {};
    const posts = await this.postModel.find(filter);
    return posts.length;
  }

  async findByQuery(dto: InputQueryDto, blogId?: string) {
    const sd = dto.sortDirection === EnumDirection.asc ? 1 : -1;
    const filter = blogId ? { blogId: blogId } : {};
    return this.postModel
      .find(filter)
      .sort({ [dto.sortBy]: sd })
      .skip((dto.pageNumber - 1) * dto.pageSize)
      .limit(dto.pageSize)
      .lean();
  }

  async deletePost(id: ObjectId) {
    return this.postModel.deleteOne({ _id: id });
  }
  convertToViewModelUtility(post: PostModel): PostViewModel {
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
  }
  async convertToViewModel(posts: PostModel[] ):Promise< PostViewModel[]  >{
    return  posts.map((el) => this.convertToViewModelUtility(el))
  }

  convertToViewPagination(
    dto: QueryPostDto,
    items: PostViewModel | PostViewModel[],
  ) {
    return Paginator.get({
      pageNumber: dto.pageNumber,
      pageSize: dto.pageSize,
      totalCount: dto.totalCount,
      items: items,
    });
  }

  async getPageInfo(dto: InputQueryDto): Promise<QueryPostDto> {
    const pageInfo = getPageInfo(dto);
    const totalCount = await this.getTotalCount();
    return {
      pageNumber: pageInfo.pageNumber,
      pageSize: pageInfo.pageSize,
      sortBy: pageInfo.sortBy,
      sortDirection: pageInfo.sortDirection,
      searchNameTerm: pageInfo.searchNameTerm,
      totalCount: totalCount,
    };
  }
}
