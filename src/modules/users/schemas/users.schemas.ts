import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema()
export class User {

  @Prop({ required: true, unique: true  })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true  })
  email: string;

}

export const TypeNewsSchema = SchemaFactory.createForClass(User);

