import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel } from './models/users.model';
import { Model } from 'mongoose';
import { CreateUserDto } from './models/users.create.dto';
import { ObjectId } from 'mongodb';
import { UserViewModel } from './models/user.view.model';
import { EnumDirection } from '../helpers/pagination/enum.direction';
import { UserQueryDto } from '../helpers/pagination/user.query.dto';
import bcrypt from 'bcrypt';
import { add } from 'date-fns';
@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserViewModel> {
    const passwordSalt: string = await bcrypt.genSalt(10);
    const passwordHash: string = await this.generateHash(
      createUserDto.password,
      passwordSalt,
    );
    const createdAt = new Date().toISOString();

    const createUser = new this.userModel({
      login: createUserDto.login,
      email: createUserDto.email,
      userPasswordHash: passwordHash,
      userPasswordSalt: passwordSalt,
      createdAt: createdAt,
      emailConfirmation: {
        confirmationCode: null,
        isConfirmed: false,
        expirationDate: add(new Date(), {
          minutes: 5,
        }),
      },
    });
    createUser.id = createUser._id.toString();

    await this.saveUser(createUser);
    return {
      id: createUser.id,
      login: createUser.login,
      email: createUser.email,
      createdAt: createUser.createdAt,
    };
  }

  async generateHash(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }

  async updateConfirmationIsConfirmed(code: string): Promise<boolean> {
    const userInstance = await this.userModel.findByIdAndUpdate(
      { 'emailConfirmation.confirmationCode': code },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
    if (!userInstance) return false;
    await this.saveUser(userInstance);
    return true;
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

  async findUserById(userId: ObjectId) {
    return this.userModel.findOne({ _id: userId });
  }

  async deleteUserById(userId: string) {
    return this.userModel.deleteOne({ id: userId });
  }

  async saveUser(user: UserDocument) {
    await user.save();
  }

  async findByQuery(dto: UserQueryDto) {
    const sd = dto.sortDirection === EnumDirection.asc ? 1 : -1;
    const filterEmail = dto.searchEmailTerm
      ? { email: { $regex: dto.searchEmailTerm, $options: 'i' } }
      : {};
    const filterLogin = dto.searchLoginTerm
      ? { login: { $regex: dto.searchLoginTerm, $options: 'i' } }
      : {};
    return this.userModel
      .find({ $or: [filterEmail, filterLogin] })
      .sort({ [dto.sortBy]: sd })
      .skip((dto.pageNumber - 1) * dto.pageSize)
      .limit(dto.pageSize)
      .lean();
  }

  async getTotalCount(searchLoginTerm?: string, searchEmailTerm?: string) {
    const filterEmail = searchEmailTerm
      ? { email: { $regex: searchEmailTerm, $options: 'i' } }
      : {};
    const filterLogin = searchLoginTerm
      ? { login: { $regex: searchLoginTerm, $options: 'i' } }
      : {};
    const user = await this.userModel.find({ $or: [filterEmail, filterLogin] });
    return user.length;
  }

  async findOne(loginOrEmail: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      $or: [
        {
          login: loginOrEmail,
        },
        {
          email: loginOrEmail,
        },
      ],
    });
  }

  async checkIsCorrectCode(code: string) {
    const user = await this.userModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
    console.log(user);
    return !!user;
  }

  async registrateConfirmCode(user: UserDocument, code: string) {
    user.emailConfirmation.confirmationCode = code;
    user.emailConfirmation.expirationDate = add(new Date(), {
      minutes: 5,
    });
    await this.saveUser(user);
    return user;
  }

  async checkUserPassword(password: string, user: UserDocument) {
    const passwordHash: string = await this.generateHash(
      password,
      user.userPasswordSalt,
    );
    if (passwordHash !== user.userPasswordHash) {
      return false;
    }
    return user;
  }

  async checkIsConfirm(user: UserDocument) {
    const res = await this.userModel.findOne(user._id);
    console.log(res);
    return res ? res.emailConfirmation.isConfirmed : false;
  }
}
