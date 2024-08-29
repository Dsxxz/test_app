import { Inject, Injectable } from '@nestjs/common';
import { UserDocument } from '../users/models/users.model';
import { LikeEnum } from './likes_models/likes.enum.model';
import { LikesRepository } from './likes.repository';

@Injectable()
export class LikesService {
  constructor(@Inject() private likesRepository: LikesRepository) {}

  async updateLikeStatus(
    commentId: string,
    likeStatus: LikeEnum,
    user: UserDocument,
  ) {
    return this.likesRepository.updateLikeStatus(commentId, likeStatus, user);
  }
}
