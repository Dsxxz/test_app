import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './models/users.create.dto';

@Controller('api/users')
export class UsersController {
  constructor(protected userService: UsersService) {}
  @Get()
  async getUsers() {
    return this.userService.getAllUsers();
  }
  @Post()
  async createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  @Delete(':id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUserById(userId);
  }

  @Get(':id')
  async getUser(@Param('id') userId: string) {
    return this.userService.getUserById(userId);
  }
}
