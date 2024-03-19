import { Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { UserModel } from './models/users.model';
import { CreateUserDto } from './models/users.create.dto';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}

  async createUser(createDto: CreateUserDto): Promise<UserModel> {
    return this.usersRepository.createUser(createDto);
  }

  async getAllUsers() {
    return this.usersRepository.getAllUsers();
  }

  async getUserById(userId: string) {
    return this.usersRepository.getUserById(userId);
  }

  async deleteUserById(userId: string) {
    return this.usersRepository.deleteUserById(userId);
  }
}
