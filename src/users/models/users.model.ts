import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;
@Schema()
export class UserConfirmationType {
  @Prop()
  confirmationCode: string;

  @Prop()
  expirationDate: Date;

  @Prop()
  isConfirmed: boolean;
}
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
  @Prop({ type: UserConfirmationType })
  emailConfirmation: UserConfirmationType;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
