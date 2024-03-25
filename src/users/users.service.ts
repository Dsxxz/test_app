import { Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { CreateUserDto } from './models/users.create.dto';
import { UserViewModel } from './models/user.view.model';
import { InputQueryDto } from '../pagination/input.query.dto';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}

  async createUser(createDto: CreateUserDto): Promise<UserViewModel> {
    return this.usersRepository.createUser(createDto);
  }

  async getAllUsers(): Promise<UserViewModel[] | []> {
    return this.usersRepository.getAllUsers();
  }

  async getUserById(userId: string) {
    return this.usersRepository.getUserById(userId);
  }

  async deleteUserById(userId: string) {
    return this.usersRepository.deleteUserById(userId);
  }

  async findByQuery(dto: InputQueryDto): Promise<UserViewModel[]> {
    const users = await this.usersRepository.findByQuery(dto);
    if (!users) return [];
    return users;
  }
}
