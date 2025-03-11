import { HydratedDocument, Model } from 'mongoose';
import { UserModel } from '../domain/users.entity';

// Typification of document
export type UserDocument = HydratedDocument<UserModel>;

// Typification of model
export type UserModelType = Model<UserDocument> & typeof UserModel;
