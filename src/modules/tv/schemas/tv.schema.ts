import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TvDocument = Tv & Document;
@Schema()
export class Tv {

    @Prop({ required: true, unique: true })
    tvCode: string;

    @Prop({ required: true })
    tvName: string;

    @Prop({ required: true })
    time: string;

    @Prop()
    describe: string;

}

export const TvSchema = SchemaFactory.createForClass(Tv);

