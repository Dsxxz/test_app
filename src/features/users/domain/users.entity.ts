import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreateUserType } from '../dto/create-user-type';
import { User, ConfirmSchema } from "../dto/user.schema";
import { ObjectId } from "mongodb";


@Schema()
export class UserModel   {
  @Prop()
  _id: ObjectId;
  @Prop()
  id: string;
  @Prop({ type: String, required: true })
  login: string;
  @Prop({ type: String, required: true })
  email: string;
  @Prop()
  createdAt: string;
  @Prop({ type: String, required: true })
  userPasswordHash: string;
  @Prop({ type: String, required: true })
  userPasswordSalt: string;
  @Prop({ type: ConfirmSchema, required: true })
  emailConfirmation: User;
  static async createInstance(dto: CreateUserType): Promise<UserModel> {
    const user = new this();
    user._id = new ObjectId();
    user.email = dto.email;
    user.login = dto.login;
    user.userPasswordHash = dto.userPasswordHash;
    user.userPasswordSalt = dto.userPasswordSalt;
    user.createdAt = dto.createdAt;
    user.emailConfirmation = {confirmationCode: dto.emailConfirmation.confirmationCode,
      isConfirmed: dto.emailConfirmation.isConfirmed,
      expirationDate: dto.emailConfirmation.expirationDate,}
    return user;
  }}




export const UserSchema = SchemaFactory.createForClass(UserModel);
UserSchema.loadClass(UserModel);
