import {
  Controller,
  Delete,
  Get,
  Param,
  UnauthorizedException,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Res,
  Put,
  Body,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { CommentCreateDTO } from './models/comment.create.dto';
import { UpdateLikeDto } from '../likes/likes_models/update.like.DTO';
import { LikesService } from '../likes/likes.service';

@Controller('api/comments')
export class CommentsController {
  constructor(
    private commentService: CommentService,
    private userService: UsersService,
    @Inject(LikesService) private likesService: LikesService,
  ) {}

  @Get(':id')
  async getCommentsById(@Param() id: string) {
    return this.commentService.getCommentById(id);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async deleteCommentById(
    @Param() id: string,
    @Request() request: any,
    @Res() res: Response,
  ) {
    const userName = request.user.username;
    if (!userName) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findOne(userName);
    if (!user || user.id !== id) {
      throw new ForbiddenException();
    }
    const comment = await this.commentService.getCommentById(id);
    if (!comment) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    return this.commentService.deleteCommentById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async updateCommentById(
    @Param() id: string,
    @Body() dto: CommentCreateDTO,
    @Request() request: any,
    @Res() res: Response,
  ) {
    const userName = request.user.username;
    if (!userName) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findOne(userName);
    if (!user || user.id !== id) {
      throw new ForbiddenException();
    }
    const comment = await this.commentService.getCommentById(id);
    if (!comment) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    return this.commentService.updateCommentById(id, dto.content);
  }

  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async updateCommentLikeStatus(
    @Param() commentId: string,
    @Body() status: UpdateLikeDto,
    @Res() res: Response,
    @Request() request: any,
  ) {
    const comment = await this.commentService.getCommentById(commentId);
    if (!comment) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    const userName = request.user.username;
    if (!userName) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findOne(userName);
    if (!user) {
      throw new UnauthorizedException();
    }
    await this.likesService.updateLikeStatus(
      commentId,
      status.likeStatus,
      user,
    );
    return { likeStatus: status.likeStatus };
  }
}
