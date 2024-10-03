import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LikeDocument, LikeModel } from './likes_models/likes.model';
import { InjectModel } from '@nestjs/mongoose';
import { LikeEnum } from './likes_models/likes.enum.model';
import { UserDocument } from '../users/models/users.model';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel(LikeModel.name)
    private readonly likeModel: Model<LikeModel>,
  ) {}
  private likeComments: LikeDocument[] = [];
  private dislikeComments: LikeDocument[] = [];
  private likePosts: LikeDocument[] = [];
  private dislikePosts: LikeDocument[] = [];

  async updateCommentLikeStatus(
    commentId: string,
    likeStatus: LikeEnum,
    user: UserDocument,
  ) {
    const like = await this.likeModel.findOne({
      commentId: commentId,
      userId: user.id,
    });
    if (!like) {
      return this.createLikeStatus(commentId, likeStatus, user);
    }
    await this.handleLike(like, likeStatus);
    return this.likeModel.updateOne(
      { _id: like._id },
      { likeStatus: likeStatus },
    );
  }

  private async createLikeStatus(
    commentId: string,
    likeStatus: LikeEnum,
    user: UserDocument,
  ) {
    const like = new this.likeModel({
      addedAt: new Date().toISOString(),
      userId: user.id,
      login: user.login,
      commentId: commentId,
      likeStatus: likeStatus,
    });
    console.log(like);
    await this.saveLike(like);
    await this.handleLike(like, likeStatus);
    return like;
  }

  private async saveLike(like: LikeDocument) {
    return await like.save();
  }
  getLikesCount(): number {
    return this.likeComments.length;
  }

  getDislikesCount(): number {
    return this.dislikeComments.length;
  }

  getLastThreeLikes(): LikeDocument[] {
    return this.likeComments.slice(-3);
  }
  private async handleLike(like: LikeDocument, status: LikeEnum) {
    switch (status) {
      case LikeEnum.None:
        this.removeLike(like);
        break;
      case LikeEnum.Like:
        this.addLike(like);
        this.removeDislike(like);
        break;
      case LikeEnum.Dislike:
        this.addDislike(like);
        this.removeLike(like);
        break;
      default:
        console.error('Something went wrong while updating like-status');
        break;
    }
  }
  private removeLike(like: LikeDocument) {
    return (this.likeComments = this.likeComments.filter(
      (item) =>
        item.commentId !== like.commentId || item.userId !== like.userId,
    ));
  }

  // Метод для удаления дизлайка из dislikeComments
  private removeDislike(like: LikeDocument) {
    return (this.dislikeComments = this.dislikeComments.filter(
      (item) =>
        item.commentId !== like.commentId || item.userId !== like.userId,
    ));
  }

  // Метод для добавления лайка в массив likeComments
  private addLike(like: LikeDocument) {
    return this.likeComments.push(like);
  }

  // Метод для добавления дизлайка в массив dislikeComments
  private addDislike(like: LikeDocument) {
    return this.dislikeComments.push(like);
  }
}
