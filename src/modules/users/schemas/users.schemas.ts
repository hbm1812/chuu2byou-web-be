import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema()
export class User {

  @Prop({ required: true, unique: true  })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  gender: number;

  @Prop({ required: true, unique: true  })
  email: string;

  @Prop({ required: true })
  admin: boolean;

  @Prop({ required: true })
  accountLevel: number;

  @Prop()
  roles: string[];

}

export const UserSchema = SchemaFactory.createForClass(User);

