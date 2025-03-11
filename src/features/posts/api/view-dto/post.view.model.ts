import { LikeEnum } from '../../../likes/dto/likes.enum.model';
import { LikeModel } from '../../../likes/domain/likes.model';

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
    newestLikes: LikeModel[];
  };
};
