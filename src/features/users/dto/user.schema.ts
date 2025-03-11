import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
  @Prop({ type: String, required: false })
  confirmationCode: string|undefined;

  @Prop({type: Date, required: true})
  expirationDate: Date;

  @Prop({type: Boolean, required: true})
  isConfirmed: boolean;
}
export const ConfirmSchema = SchemaFactory.createForClass(User);
ConfirmSchema.loadClass(User);