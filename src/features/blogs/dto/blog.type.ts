import { HydratedDocument, Model } from 'mongoose';
import { BlogModel } from '../domain/blogs.model';

// Typification of document
export type BlogDocument = HydratedDocument<BlogModel>;

// Typification of model
export type BlogModelType = Model<BlogDocument> & typeof BlogModel;
