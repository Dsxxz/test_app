import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PostDocument, PostModel } from '../domain/posts.entity';
import { PostsModelDto } from '../dto/posts.model.dto';
import { EnumDirection } from '../../../core/dto/pagination/enum.direction';
import {
  getPageInfo,
  InputQueryDto,
  QueryPostDto,
} from '../../../core/dto/pagination/input.query.dto';
import { NewLikeViewModel, PostViewModel } from "../api/view-dto/post.view.model";
import { LikeEnum } from '../../likes/dto/likes.enum.model';
import { ObjectId } from 'mongodb';
import { Paginator } from '../../../core/dto/pagination/paginator';
import { UpdateLikeDto } from "../../likes/dto/update.like.DTO";
import { NewLikeModel } from "../../likes/dto/newLike.type";
import { UserDocument } from "../../users/dto/user.type";

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
    post.extendedLikesInfo = {likesCount:[],dislikeCount:[],myStatus:LikeEnum.None, newestLikes: []  }
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
    const newestLikes = post.extendedLikesInfo.newestLikes;
    const lastThreeLikes: NewLikeViewModel[] = [];
        if(newestLikes){
          const filteredLikes = newestLikes
            .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
            .map(el => {
              return {
                addedAt: el.addedAt.toISOString(),
                userId: el.userId.toString(),
                login: el.login
              };
            });
          lastThreeLikes.push(...filteredLikes.slice(0, 3));
        }
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: post.extendedLikesInfo.likesCount?.length || 0,
        dislikesCount: post.extendedLikesInfo.dislikeCount?.length || 0,
        myStatus: post.extendedLikesInfo.myStatus as LikeEnum,
        newestLikes: lastThreeLikes || [],
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

  async updatePostLikeStatus(id: string, likeStatus: UpdateLikeDto, user?: UserDocument) {
    const post = await this.postModel.findById(id);
    if(!post){
      throw new Error('updatePostLikeStatus: post not found')
    }
    if(!user || !user.id){
      //todo: change return type
      return post;
    }

    const dislikeIndex = post.extendedLikesInfo.dislikeCount.indexOf(user.id);
    const likeIndex = post.extendedLikesInfo.likesCount.indexOf(user.id);

    switch (likeStatus.likeStatus) {

      case LikeEnum.None:
        if(dislikeIndex !==-1){
          post.extendedLikesInfo.dislikeCount.splice(dislikeIndex, 1);
        }
        if(likeIndex !==-1){
          post.extendedLikesInfo.dislikeCount.splice(likeIndex, 1);
        }
        break;

      case LikeEnum.Like:
        if (!post.extendedLikesInfo.likesCount.includes(user.id)) {
          post.extendedLikesInfo.likesCount.push(user.id);
        }
        if(dislikeIndex !==-1){
          post.extendedLikesInfo.dislikeCount.splice(dislikeIndex, 1);
        }
        const newLike:NewLikeModel = { addedAt:new Date(),userId: new ObjectId(user.id), login: user.login};
        post.extendedLikesInfo.newestLikes.push(newLike);
        post.extendedLikesInfo.myStatus = LikeEnum.Like;
        break;

      case LikeEnum.Dislike:
        if(!post.extendedLikesInfo.dislikeCount.includes(user.id)){
          post.extendedLikesInfo.dislikeCount.push(user.id);
        }
        if(likeIndex !==-1){
          post.extendedLikesInfo.dislikeCount.splice(likeIndex, 1);
        }
        post.extendedLikesInfo.myStatus = LikeEnum.Dislike;
        break;


      default: console.error('update post like status: unknown like status')

    }

    return this.savePost(post);
  }
}
