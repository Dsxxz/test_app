import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { Response } from "express";
import { PostService } from "../application/posts.service";
import { PostsModelDto } from "../dto/posts.model.dto";
import { PaginationQueryDto } from "../../../core/dto/pagination/paginationQueryDto";
import { BlogService } from "../../blogs/application/blogs.service";
import { PostQueryRepo } from "../infrastructure/posts.query.repo";
import { CommentCreateDTO } from "../../comments/api/input-dto/comment.create.dto";
import { CommentService } from "../../comments/application/comment.service";
import { JwtAuthGuard } from "../../../core/guards/jwt.auth.guard";
import { BearerAuthGuard } from "../../../core/guards/bearer.guard";
import { BasicAuthGuard } from "../../../core/guards/basic.auth.guard";
import { UsersService } from "../../users/application/users.service";
import { UpdateLikeDto } from "../../likes/dto/update.like.DTO";
import { CurrentUserId } from "../../../core/decorators/currentUserIdFromHeaders.decorator";
import { PostViewModel } from "./view-dto/post.view.model";

@Controller( '/posts')
export class PostsController {
  constructor(
    protected postService: PostService,
    protected blogService: BlogService,
    protected postQueryRepo: PostQueryRepo,
    protected commentPostService: CommentService,
    protected userService: UsersService,
  ) {}

  @Get(':id')
  async getOnePost(@Param('id') id: string, @Res() res: Response, @Req() request: any) {
    const user = request.user;
    console.log("user", user);
    const post = await this.postService.findPostById(id, user?._id.toString());
    if (!post) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    return res.status(HttpStatus.OK).send(post);
  }

  @Get()
  async findAllPosts(@Query() dto: PaginationQueryDto, @Res() res: Response, @CurrentUserId() currentUserId?: any,) {
    const queryPostDto = await this.postQueryRepo.getPageInfo(dto);
    console.log("req.user", currentUserId)
    const posts: PostsModelDto[] =
      await this.postQueryRepo.findByQuery(queryPostDto);
    if (!posts) res.sendStatus(HttpStatus.NOT_FOUND);
    const result1 = await this.postQueryRepo.convertToViewPagination(
      queryPostDto,
      posts as  PostViewModel[]
    )
    return res.send(result1);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createPostForBlog(@Body() dto: PostsModelDto, @Res() res: Response) {
    const foundBlog = await this.blogService.findBlogById(dto.blogId);
    if (!foundBlog) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send([{ message: 'Blog must exist', field: 'blogId' }]);
    }
    const post = await this.postService.createPost({
      ...dto,
      blogId: dto.blogId,
    });
    return res.send(post);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('id') id: string,
    @Body() dto: Partial<PostsModelDto>,
    @Res() res: Response,
  ) {
    const post = await this.postService.findPostById(id);
    if (!post) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    await this.postService.updatePost(id, dto);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('id') id: string, @Res() res: Response) {
    const post = await this.postService.findPostById(id);
    if (!post) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    await this.postService.deletePost(id);
    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @HttpCode(404)
  @Get(':id/comments')
  async getCommentsForPostById() {
    return;
  }
  @Post(':id/comments')
  @UseGuards(BearerAuthGuard)
  async createCommentForPost(
    @Body() dto: CommentCreateDTO,
    @Req() request: any,
  ) {
    const userName = request.user.username;
    const user = await this.userService.findOne(userName);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    const userDTO = {
      userId: user.id,
      userLogin: user.login,
    };
    return this.commentPostService.createCommentForPost(dto, userDTO);
  }
  @UseGuards(BearerAuthGuard)
  @Put(':id/like-status')
  async updatePostLikeStatus(
    @Param('id') id: string,
    @Body() likeStatus: UpdateLikeDto,
    @Res() res: Response,
    @CurrentUserId() currentUserId: any,
  ) {
    const post = await this.postService.findPostById(id);
    if (!post) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    // ищем юзера по current id
    const user = await this.userService.findUserById(currentUserId.id);
    //проверяем есть ли у нас такой юзер
    if(!currentUserId || !user){
      throw new HttpException('incorrect credential', HttpStatus.UNAUTHORIZED)
    }
    const result = await this.postService.updatePostLikeStatus(post.id, likeStatus, { userId:currentUserId.id, login: user.login });
    return res.status(204).send(result)
  }
  //todo: take userId from JWT;
}
