import { Inject, Injectable } from '@nestjs/common';
import { LikeEnum } from '../dto/likes.enum.model';
import { LikesRepository } from '../infrastructure/likes.repository';
import { UserDocument } from '../../users/dto/user.type';

@Injectable()
export class LikesService {
  constructor(@Inject() private likesRepository: LikesRepository) {}

  async updateLikeStatus(
    commentId: string,
    likeStatus: LikeEnum,
    user: UserDocument,
  ) {
    return this.likesRepository.updateCommentLikeStatus(
      commentId,
      likeStatus,
      user,
    );
  }
}
