import { IsEnum } from 'class-validator';
import { LikeEnum } from './likes.enum.model';

export class UpdateLikeDto {
  @IsEnum(LikeEnum)
  likeStatus: LikeEnum;
}
