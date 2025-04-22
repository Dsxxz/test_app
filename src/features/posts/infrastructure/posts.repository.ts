import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PostDocument, PostModel } from "../domain/posts.entity";
import { PostsModelDto } from "../dto/posts.model.dto";
import { EnumDirection } from "../../../core/dto/pagination/enum.direction";
import { getPageInfo, PaginationQueryDto, QueryPostDto } from "../../../core/dto/pagination/paginationQueryDto";
import { NewLikeViewModel, PostViewModel } from "../api/view-dto/post.view.model";
import { LikeEnum } from "../../likes/dto/likes.enum.model";
import { ObjectId } from "mongodb";
import { Paginator } from "../../../core/dto/pagination/paginator";
import { UpdateLikeDto } from "../../likes/dto/update.like.DTO";
import { NewLikeModel } from "../../likes/dto/newLike.type";

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
    post.extendedLikesInfo = {likesCount:[],dislikeCount:[], newestLikes: []  }
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

  async findByQuery(dto: PaginationQueryDto, blogId?: string) {
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
  convertToViewModelUtility(post: PostModel, userId?: string): PostViewModel {
    const newestLikes = post.extendedLikesInfo.newestLikes;
    const lastThreeLikes: NewLikeViewModel[] = [];
    let statusLike = LikeEnum.None;

        if(Array.isArray(newestLikes) && newestLikes.length > 0){
          console.log("101111newestLikes",newestLikes);
          console.log((newestLikes[0].addedAt) instanceof Date);
          console.log(newestLikes[0].addedAt);
          const filteredLikes = newestLikes
            .sort((a, b) => {
              return a.addedAt > b.addedAt ? 1 : -1;
            })
            .map(el => {
              return {
                addedAt: el.addedAt.toISOString(),
                userId: el.userId.toString(),
                login: el.login
              };
            });
          lastThreeLikes.push(...filteredLikes.slice(0, 3));
        }
    if(userId){
      const userLike = post.extendedLikesInfo.dislikeCount.includes(userId);
      if(userLike)statusLike = LikeEnum.Like;
      const userDislike = post.extendedLikesInfo.likesCount.includes(userId);
      if(userDislike)statusLike = LikeEnum.Dislike;
    }
    else{
      statusLike = LikeEnum.None;
    }//todo: mapping to view model
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
        myStatus: statusLike as LikeEnum,
        newestLikes: lastThreeLikes,
      },
    };
  }
   convertToViewModel(posts: PostModel[], userId?: string):PostViewModel[]{
    return posts.map((el) => this.convertToViewModelUtility(el,userId));
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

  async getPageInfo(dto: PaginationQueryDto): Promise<QueryPostDto> {
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

  async updatePostLikeStatus(id: string, likeStatus: UpdateLikeDto, user: {userId: string, login: string}) {
    const post = await this.postModel.findById(id);
    if(!post){
      throw new Error('updatePostLikeStatus: post not found')
    }
    if(!user || !user.userId || !user.login){
      //todo: change return type
      //todo: change this error
      throw new Error('updatePostLikeStatus: user not found');
    }

    const dislikeIndex = post.extendedLikesInfo.dislikeCount.indexOf(user.userId);
    const likeIndex = post.extendedLikesInfo.likesCount.indexOf(user.userId);

    switch (likeStatus.likeStatus) {

      case LikeEnum.None:
        if(dislikeIndex !== -1){
          //todo: delete from array newestLikes

          post.extendedLikesInfo.dislikeCount.splice(dislikeIndex, 1);
        }
        if(likeIndex !== -1){
          post.extendedLikesInfo.likesCount.splice(likeIndex, 1);
        }
        break;

      case LikeEnum.Like:
        if (!post.extendedLikesInfo.likesCount.includes(user.userId)) {
          post.extendedLikesInfo.likesCount.push(user.userId);
          //todo change to string type in NewLikeModel 'userId: new ObjectId(user.id)'
          const newLike:NewLikeModel = { addedAt:new Date(),userId:  ObjectId.createFromHexString(user.userId), login: user.login};
          post.extendedLikesInfo.newestLikes.push(newLike);
        }
        if(dislikeIndex !==-1){
          post.extendedLikesInfo.dislikeCount.splice(dislikeIndex, 1);
        }

        break;

      case LikeEnum.Dislike:
        if(!post.extendedLikesInfo.dislikeCount.includes(user.userId)){
          post.extendedLikesInfo.dislikeCount.push(user.userId);
          //todo: delete from array newestLikes
        }
        if(likeIndex !==-1){
          post.extendedLikesInfo.dislikeCount.splice(likeIndex, 1);
        }
        break;


      default: console.error('update post like status: unknown like status')

    }
    return this.savePost(post);
  }
}
