import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MenuTypeDocument = MenuType & Document;
@Schema()
export class MenuType {

  @Prop({ required: true, unique: true })
  menuTypeCode: string;

  @Prop({ required: true })
  menuTypeName: string;

}

export const MenuTypeSchema = SchemaFactory.createForClass(MenuType);

