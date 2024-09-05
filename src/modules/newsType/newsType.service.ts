import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TypeNews, TypeNewsDocument } from './schemas/newsType.schema';

@Injectable()
export class NewsTypeService {
    constructor(@InjectModel(TypeNews.name) private typeNewsModel: Model<TypeNewsDocument>) { }
    async getAll(): Promise<TypeNews[]> {
        return this.typeNewsModel.find().exec();
    }

    async createLoaiTinTuc(type_name_jp: string, type_name_en: string): Promise<any> {
        const data = new this.typeNewsModel({ type_name_jp, type_name_en });
        const result = await data.save();
        const Obj = result.toObject();
        return Obj;
    }
}
