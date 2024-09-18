import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsDocument = News & Document;
@Schema()
export class News {

    @Prop({ required: true, unique: true })
    newsCode: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    thumbnail: string;

    @Prop({ required: true })
    typeCode: string;

    @Prop({ required: true })
    upLoadDate: string;

    @Prop({ required: true })
    content: string;

    @Prop()
    relatedInformation: string;

    // @Prop({ required: false})
    // typeNameCN: string;


}

export const NewsSchema = SchemaFactory.createForClass(News);

