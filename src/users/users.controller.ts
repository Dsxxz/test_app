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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './models/users.create.dto';
import { UserViewModel } from './models/user.view.model';
import { getPageInfo, InputQueryDto } from '../pagination/input.query.dto';
import { Paginator } from '../pagination/paginator';

@Controller('/users')
export class UsersController {
  constructor(protected userService: UsersService) {}
  @Get()
  async getUsers(
    @Query() dto: Partial<InputQueryDto>,
  ): Promise<Paginator<UserViewModel[]>> {
    const pageInfo = getPageInfo(dto);
    const totalCount = await this.userService.getTotalCount();
    const users = await this.userService.findByQuery(pageInfo as InputQueryDto);
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
  async createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userService.deleteUserById(userId);
    return;
  }

  @Get(':id')
  async getUser(@Param('id') userId: string) {
    return this.userService.getUserById(userId);
  }
}
