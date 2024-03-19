import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel } from './models/users.model';
import { Model } from 'mongoose';
import { CreateUserDto } from './models/users.create.dto';
import { ObjectId } from 'mongodb';
import { UserViewModel } from './models/user.view.model';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserViewModel> {
    const createUser = new this.userModel(createUserDto);
    createUser.createdAt = new Date().toISOString();
    createUser.id = createUser._id.toString();
    await this.saveUser(createUser);
    return {
      id: createUser.id,
      login: createUser.login,
      email: createUser.email,
      createdAt: createUser.createdAt,
    };
  }

  async getAllUsers(): Promise<UserViewModel[] | []> {
    const users = await this.userModel.find({}).exec();
    if (users) {
      return users.map((user) => {
        return {
          id: user.id,
          login: user.login,
          email: user.email,
          createdAt: user.createdAt,
        };
      });
    }
    return [];
  }

  async getUserById(userId: string) {
    return this.userModel.findOne({ _id: new ObjectId(userId) });
  }

  async deleteUserById(userId: string) {
    return this.userModel.deleteOne({ id: userId });
  }

  async saveUser(user: UserDocument) {
    await user.save();
  }
}
