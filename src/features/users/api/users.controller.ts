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
import { UsersService } from '../application/users.service';
import {
  QueryDto,

} from "../../../core/dto/pagination/user.query.dto";
import { Paginator } from '../../../core/dto/pagination/paginator';
import { UserViewModel } from './view-dto/users.view-dto';
import { BasicAuthGuard } from '../../../core/guards/basic.auth.guard';
import { InputUserDto } from './input-dto/input-user-dto';
import { UserQueryRepository } from "../infrastructure/users.query-repository";

@Controller('/users')
export class UsersController {
  constructor(protected userService: UsersService, protected userQueryRepository:UserQueryRepository) {}
  @Get()
  async getUsers(
    @Query() dto: Partial<QueryDto>,
  ): Promise<Paginator<UserViewModel[]>> {
    return this.userQueryRepository.findAllUsers(dto);
  }
  @Post()
  @UseGuards(BasicAuthGuard)
  async createUsers(@Body() createUserDto: InputUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async deleteUser(@Param('id') userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    await this.userService.deleteUserById(userId);
    return;
  }

  @Get(':id')
  async getUser(@Param('id') userId: string) {
    return this.userService.findUserById(userId);
  }
}
