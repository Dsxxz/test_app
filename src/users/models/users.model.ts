import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;

@Schema()
export class UserModel {
  @Prop()
  id: string;
  @Prop()
  login: string;
  @Prop()
  email: string;
  @Prop()
  createdAt: string;
  @Prop()
  userPasswordHash: string;
  @Prop()
  userPasswordSalt: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
