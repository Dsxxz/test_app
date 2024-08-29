import {
  Body,
  Controller,
  Get,
  Query,
  HttpCode,
  Param,
  Post,
  Put,
  HttpStatus,
  Delete,
  Res,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { PostService } from './posts.service';
import { PostsModelDto } from './models/posts.model.dto';
import { InputQueryDto } from '../helpers/pagination/input.query.dto';
import { BlogService } from '../blogs/blogs.service';
import { PostQueryRepo } from './posts.query.repo';
import { PostViewModel } from './models/post.view.model';
import { CommentCreateDTO } from '../comments/models/comment.create.dto';
import { CommentService } from '../comments/comment.service';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { UsersService } from '../users/users.service';

@Controller('/posts')
export class PostsController {
  constructor(
    protected postService: PostService,
    protected blogService: BlogService,
    protected postQueryRepo: PostQueryRepo,
    protected commentPostService: CommentService,
    protected userService: UsersService,
  ) {}

  @Get(':id')
  async getOnePost(@Param('id') id: string, @Res() res: Response) {
    const post = await this.postService.findPostById(id);
    if (!post) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }
    return res.status(HttpStatus.OK).send(post);
  }

  @Get()
  async findAllPosts(@Query() dto: InputQueryDto, @Res() res: Response) {
    const queryPostDto = await this.postQueryRepo.getPageInfo(dto);
    const posts: PostsModelDto[] =
      await this.postQueryRepo.findByQuery(queryPostDto);
    if (!posts) res.sendStatus(HttpStatus.NOT_FOUND);
    const result: PostViewModel | PostViewModel[] =
      this.postQueryRepo.convertToViewModel(posts);
    const result1 = await this.postQueryRepo.convertToViewPagination(
      queryPostDto,
      result,
    );
    return res.send(result1);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPostForBlog(@Body() dto: PostsModelDto, @Res() res: Response) {
    const foundBlog = await this.blogService.findBlogById(dto.blogId);
    if (!foundBlog) {
      return res
        .status(HttpStatus.NOT_FOUND)
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
  @UseGuards(JwtAuthGuard)
  async createCommentForPost(
    @Body() dto: CommentCreateDTO,
    @Request() request: any,
  ) {
    console.log(request);
    const userName = request.user.username;
    console.log(userName);
    const user = await this.userService.findOne(userName);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    const userDTO = {
      userId: user.id,
      userLogin: user.login,
    };
    console.log(userDTO);
    return this.commentPostService.createCommentForPost(dto, userDTO);
  }
}
