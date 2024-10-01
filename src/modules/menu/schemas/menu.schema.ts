import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MenuDocument = Menu & Document;
@Schema()
export class Menu {

    @Prop({ required: true, unique: true })
    key: string;
  
    @Prop({ required: true })
    code: string;
  
    @Prop()
    parentCode: string;
  
    @Prop({ required: true })
    name: string;
  
    @Prop()
    path: string;
  
    @Prop()
    icon: string;
  
    @Prop()
    landing: number;
  
    @Prop()
    showMenu: number;
  
    @Prop({ type: [{ type: Object }] })
    children: Menu[];
  

}

export const MenuSchema = SchemaFactory.createForClass(Menu);

