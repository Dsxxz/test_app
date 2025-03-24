import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { commentDocument, CommentModel } from '../domain/comment.entity';
import { Model } from 'mongoose';
import { UserCommentDto } from '../dto/user.comment.DTO';
import { CommentCreateDTO } from '../api/input-dto/comment.create.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(CommentModel.name)
    private readonly commentModel: Model<CommentModel>,
  ) {}

  async createComment(dto: CommentCreateDTO, userCommentDto: UserCommentDto) {
    const newComment = new this.commentModel({
      content: dto.content,
      commentatorInfo: {
        userId: userCommentDto.userId,
        userLogin: userCommentDto.userLogin,
      },
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikeCount: 0,
        myStatus: 'None',
      },
    });

    await this.saveComment(newComment);
    return this.generateToViewModel(newComment);
  }
  async generateToViewModel(comment: commentDocument) {
    return {
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt,
      likesInfo: comment.likesInfo,
    };
  }
  private async saveComment(comment: commentDocument) {
    return await comment.save();
  }

  async getCommentById(id: string) {
    const comment = await this.commentModel.findOne({ _is: new ObjectId(id) });
    if (!comment) {
      throw new BadRequestException('Comment does/`t found');
    }
    return this.generateToViewModel(comment);
  }

  async deleteCommentById(id: string) {
    return this.commentModel.deleteOne({ _id: id });
  }

  async updateCommentById(id: string, content: string) {
    const comment = await this.commentModel.findOne({ _id: id });
    if (!comment) {
      throw new BadRequestException('Comment does/`t found');
    }
    return this.commentModel.updateOne({ _id: id }, { content: content });
  }
}
