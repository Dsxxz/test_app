import { Inject, Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CommentCreateDTO } from '../api/input-dto/comment.create.dto';
import { UserCommentDto } from '../dto/user.comment.DTO';
import { UsersRepository } from '../../users/infrastructure/users.repository';

@Injectable()
export class CommentService {
  constructor(
    @Inject(CommentsRepository)
    protected commentsRepository: CommentsRepository,
    @Inject(UsersRepository)
    protected usersRepository: UsersRepository,
  ) {}
  async createCommentForPost(
    dto: CommentCreateDTO,
    userCommentDto: UserCommentDto,
  ) {
    return this.commentsRepository.createComment(dto, userCommentDto);
  }

  async getCommentById(id: string) {
    return this.commentsRepository.getCommentById(id);
  }

  async deleteCommentById(id: string) {
    return this.commentsRepository.deleteCommentById(id);
  }

  async updateCommentById(id: string, content: string) {
    return this.commentsRepository.updateCommentById(id, content);
  }
}
