import { Injectable } from '@nestjs/common';

import { ObjectId } from 'mongodb';

import { randomBytes } from 'crypto';
import { InputUserDto } from '../api/input-dto/input-user-dto';
import { UserViewModel } from '../api/view-dto/users.view-dto';
import { CreateAuthLoginDto } from '../../auth/dto/create-auth-login-dto';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}

  async createUser(createDto: InputUserDto): Promise<UserViewModel> {
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

  // async checkIsCorrectCode(code: string) {
  //   return this.usersRepository.checkIsCorrectCode(code);
  // }
  async deleteUserById(userId: string) {
    return this.usersRepository.deleteUserById(userId);
  }
  async checkOldPassword(oldPassword: string, userId: ObjectId){
    //TODO: change this DTO;
    return this.usersRepository.checkOldPassword(oldPassword, userId);
  }

  async getTotalCount(searchLoginTerm?: string, searchEmailTerm?: string) {
    return this.usersRepository.getTotalCount(searchLoginTerm, searchEmailTerm);
  }

  async findOne(loginOrEmail: string) {
    return this.usersRepository.findOne(loginOrEmail);
  }

  // async getAllUsers() {
  //   return this.usersRepository.getAllUsers();
  // }

  // async checkIsConfirm(code: string): Promise<boolean> {
  //   const user = await this.usersRepository.findOne(code);
  //   return user ? user.emailConfirmation.isConfirmed : false;
  // }

  async updateConfirmationIsConfirmed(code: string) {
    return this.usersRepository.updateConfirmationIsConfirmed(code);
  }
  generateRandomString(length: number) {
    return randomBytes(length).toString('hex').slice(0, length);
  }

  async registrateConfirmCode(id: ObjectId) {
    const code = this.generateRandomString(6);
    const user = await this.usersRepository.findUserById(id);
    if (!user) {
      throw new Error('something went wrong while confirmation user');
    }
    await this.usersRepository.registrateConfirmCode(user, code);
    return code;
  }

  async loginUser(registrateDTO: CreateAuthLoginDto) {
    const user = await this.usersRepository.findOne(registrateDTO.loginOrEmail);
    if (!user) {
      return false;
    }
    const password = await this.usersRepository.checkUserPassword(
      registrateDTO.password,
      user,
    );
    if (!password) {
      return false;
    }
    return user;
  }

  async findUserByCode(code: string) {
    return this.usersRepository.findUserByCode(code);
  }

  async updatePasswordData(dto: { newPassword: string; recoveryCode: string }, userId: ObjectId) {
    //TODO:change this DTO;
    return this.usersRepository.updatePasswordData(dto, userId);
  }
}
