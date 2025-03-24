import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
@Schema()
export class NewLikeModel {
  @Prop({type: Date, required: true})
  addedAt: Date;
  @Prop({ type: mongoose.Schema.Types.ObjectId})
  userId: ObjectId;
  @Prop()
  login: string;
}

export const NewLikeSchema = SchemaFactory.createForClass(NewLikeModel);
NewLikeSchema.loadClass(NewLikeModel);
export type LikeDocument = mongoose.HydratedDocument<NewLikeModel>;