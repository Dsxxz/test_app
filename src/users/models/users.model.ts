import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;

@Schema()
export class UserModel {
  @Prop()
  id: string;
  @Prop({ required: true })
  login: string;
  @Prop()
  email: string;
  @Prop()
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
