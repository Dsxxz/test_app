import { Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { CreateUserDto } from './models/users.create.dto';
import { UserViewModel } from './models/user.view.model';
import { ObjectId } from 'mongodb';
import { UserQueryDto } from '../helpers/pagination/user.query.dto';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}

  async createUser(createDto: CreateUserDto): Promise<UserViewModel> {
    return this.usersRepository.createUser(createDto);
  }

  async findUserById(userId: string) {
    const user = await this.usersRepository.findUserById(new ObjectId(userId));
    return user
      ? {
          id: user.id,
          login: user.login,
          email: user.email,
          createdAt: user.createdAt,
        }
      : null;
  }

  async deleteUserById(userId: string) {
    return this.usersRepository.deleteUserById(userId);
  }

  async findByQuery(dto: UserQueryDto): Promise<UserViewModel[]> {
    const users = await this.usersRepository.findByQuery(dto);
    if (!users) return [];
    return users.map((user) => {
      return {
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      };
    });
  }

  async getTotalCount(searchLoginTerm?: string, searchEmailTerm?: string) {
    return this.usersRepository.getTotalCount(searchLoginTerm, searchEmailTerm);
  }

  async findOne(loginOrEmail: string) {
    return this.usersRepository.findOne(loginOrEmail);
  }

  async getAllUsers() {
    return this.usersRepository.getAllUsers();
  }

  async checkIsConfirm(code: string): Promise<boolean> {
    const user = await this.usersRepository.findUserById(new ObjectId(code));
    return user ? user.emailConfirmation.isConfirmed : false;
  }

  async updateConfirmationIsConfirmed(code: string) {
    return this.usersRepository.updateConfirmationIsConfirmed(code);
  }
}
