import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GlobalMenuDocument = GlobalMenu & Document;
@Schema()
export class GlobalMenu {
  
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
    children: GlobalMenu[];
  

}

export const GlobalMenuSchema = SchemaFactory.createForClass(GlobalMenu);



