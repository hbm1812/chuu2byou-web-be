import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type Type_newsDocument = Type_news & Document;
@Schema()
export class Type_news {

  @Prop({ required: true })
  type_name_jp: string;

  @Prop({ required: true})
  type_name_en: string;

}

export const Type_newsSchema = SchemaFactory.createForClass(Type_news);