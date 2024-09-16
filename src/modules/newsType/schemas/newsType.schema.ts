import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TypeNewsDocument = TypeNews & Document;
@Schema()
export class TypeNews {

  @Prop({ required: true, unique: true })
  typeCode: string;

  @Prop({ required: true })
  typeNameJP: string;

  // @Prop({ required: false})
  // typeNameEN: string;

  // @Prop({ required: false})
  // typeNameCN: string;


}

export const TypeNewsSchema = SchemaFactory.createForClass(TypeNews);

