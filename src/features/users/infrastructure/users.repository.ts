import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";

import bcrypt from "bcrypt";
import { add } from "date-fns";
import { UserModel } from "../domain/users.entity";
import { InputUserDto } from "../api/input-dto/input-user-dto";
import { UserViewModel } from "../api/view-dto/users.view-dto";
import { UserDocument } from "../dto/user.type";
import e from "express";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: InputUserDto): Promise<UserViewModel> {
    const passwordData = await this.createPasswordHash(createUserDto.password)
    const createUser: UserModel = await UserModel.createInstance({
      ...createUserDto,
      userPasswordHash: passwordData.passwordHash,
      userPasswordSalt: passwordData.passwordSalt,
      emailConfirmation: {
        isConfirmed: false,
        expirationDate: add(new Date(), {
          minutes: 5,
        }),
      },
      createdAt: new Date().toISOString(),
    });
    await this.saveUser(createUser);
    return {
      id: createUser._id.toString(),
      login: createUser.login,
      email: createUser.email,
      createdAt: createUser.createdAt,
    };
  }
  async createPasswordHash(password: string){
    const passwordSalt: string = await bcrypt.genSalt(10);
    const passwordHash: string = await this.generateHash(
      password,
      passwordSalt,
    );
    return {passwordHash, passwordSalt};
  }
  async checkOldPassword(oldPassword: string, userId: ObjectId){
    const user = await this.findUserById(userId);
    const isPasswordHash = await this.createPasswordHash(oldPassword);
    return !(user?.userPasswordHash === isPasswordHash.passwordHash);
  };

  async saveUser(user:UserModel) {
    return new this.userModel(user).save();
  }

  async generateHash(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }

  async updateConfirmationIsConfirmed(code: string): Promise<boolean> {
    //TODO: add check expirationDate;
    const userInstance = await this.userModel.findOneAndUpdate(
      { 'emailConfirmation.confirmationCode': code },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
    return !!userInstance;
  }

  async getAllUsers(): Promise<UserViewModel[] | []> {
    const users = await this.userModel.find({}).exec();
    if (users) {
      return users;
    }
    return [];
  }

  async findUserById(userId: ObjectId) {
    const user = await this.userModel.findOne({ _id: userId });
    return user ? user as UserDocument : null;
  }

  async deleteUserById(userId: string) {
    return this.userModel.deleteOne({ id: userId });
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
    const user = await this.userModel
      .findOne({
        'emailConfirmation.confirmationCode': code,
      })
      .exec();
    return !!user;
  }

  async registrateConfirmCode(user: UserDocument, code: string) {
    user.emailConfirmation.confirmationCode = code;
    user.emailConfirmation.expirationDate = add(new Date(), {
      minutes: 5,
    });
    await user.save();
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
    return res ? res.emailConfirmation.isConfirmed : false;
  }

  async findUserByCode(code: string) {
    const user = await this.userModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
    return user ? user : false;
  }

  async updatePasswordData(dto: { newPassword: string; recoveryCode: string }, userId: ObjectId) {
    //TODO: create updating method;
    //TODO: change DTO;;
    const user = await this.userModel.findOne(userId);
    if(!user){
      console.log(`user.repository.ts 160`);
      throw new Error(`user not found`)
    }
    const passwordData = await this.createPasswordHash(dto.newPassword);
    user.userPasswordHash = passwordData.passwordHash;
    user.userPasswordSalt = passwordData.passwordSalt;
    await this.saveUser(user);
    return true;
  }
}
