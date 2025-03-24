import { LikeEnum } from '../../../likes/dto/likes.enum.model';
import { NewLikeModel } from "../../../likes/dto/newLike.type";

export class NewLikeViewModel {
  addedAt:string;
  userId:string;
  login:string;
}

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeEnum;
    newestLikes: NewLikeViewModel[];
  };
};
