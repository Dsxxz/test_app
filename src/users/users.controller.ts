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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './models/users.create.dto';
import { UserViewModel } from './models/user.view.model';

@Controller('api/users')
export class UsersController {
  constructor(protected userService: UsersService) {}
  @Get()
  async getUsers(): Promise<UserViewModel[] | []> {
    return this.userService.getAllUsers();
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
