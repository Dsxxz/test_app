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
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './models/users.create.dto';
import { UserViewModel } from './models/user.view.model';
import { Paginator } from '../helpers/pagination/paginator';
import {
  getUserPageInfo,
  UserQueryDto,
} from '../helpers/pagination/user.query.dto';
import { BasicAuthGuard } from '../auth/guards/basic.auth.guard';

@Controller('/users')
export class UsersController {
  constructor(protected userService: UsersService) {}
  @Get()
  async getUsers(
    @Query() dto: Partial<UserQueryDto>,
  ): Promise<Paginator<UserViewModel[]>> {
    const pageInfo = getUserPageInfo(dto);
    const totalCount = await this.userService.getTotalCount(
      pageInfo.searchLoginTerm,
      pageInfo.searchEmailTerm,
    );
    const users = await this.userService.findByQuery(pageInfo as UserQueryDto);
    if (!users) {
      return Paginator.get({
        pageNumber: +pageInfo.pageNumber,
        pageSize: +pageInfo.pageSize,
        totalCount: +totalCount,
        items: [],
      });
    }
    return Paginator.get({
      pageNumber: +pageInfo.pageNumber,
      pageSize: +pageInfo.pageSize,
      totalCount: +totalCount,
      items: users,
    });
  }
  @Post()
  @UseGuards(BasicAuthGuard)
  async createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async deleteUser(@Param('id') userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userService.deleteUserById(userId);
    return;
  }

  @Get(':id')
  async getUser(@Param('id') userId: string) {
    return this.userService.findUserById(userId);
  }
}
