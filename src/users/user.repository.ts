import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel } from './models/users.model';
import { Model } from 'mongoose';
import { CreateUserDto } from './models/users.create.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const createUser = new this.userModel(createUserDto);
    return createUser.save();
  }

  async getAllUsers() {
    return this.userModel.find({});
  }

  async getUserById(userId: string) {
    return this.userModel.findOne({ _id: new ObjectId(userId) });
  }

  async deleteUserById(userId: string) {
    return this.userModel.deleteOne({ _id: new ObjectId(userId) });
  }
}
