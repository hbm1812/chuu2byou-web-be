import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorksDocument = Works & Document;
@Schema()
export class Works {

    @Prop({ required: true, unique: true })
    workCode: string;

    @Prop({ required: true })
    workName: string;

    @Prop()
    description:string;

}

export const WorksSchema = SchemaFactory.createForClass(Works);

