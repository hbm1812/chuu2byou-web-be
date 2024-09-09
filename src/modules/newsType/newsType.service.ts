import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TypeNews, TypeNewsDocument } from './schemas/newsType.schema';
import { TranslationService } from '../translation/translation.service';




@Injectable()

export class NewsTypeService {
    constructor(
        @InjectModel(TypeNews.name) private readonly typeNewsModel: Model<TypeNewsDocument>,
        private readonly translationService: TranslationService,  // Inject TranslationService
      ) {}
    
    
    async getAll(): Promise<TypeNews[]> {
        return this.typeNewsModel.find().exec();
    }

    async createLoaiTinTuc(typeNameJP: string ): Promise<any> {
        const data = new this.typeNewsModel({ typeNameJP });
        const result = await data.save();
        const Obj = result.toObject();
        return Obj;
    }
    
    // async createLoaiTinTuc(typeNameJP: string): Promise<any> {
    //     // Dịch từ typeNameJP sang tiếng Anh và tiếng Trung
    //     const typeNameEN = await this.translationService.translateText(typeNameJP, 'jpn', 'eng');
    //     const typeNameCN = await this.translationService.translateText(typeNameJP, 'jpn', 'zho');
    
    //     // Tạo đối tượng mới và lưu vào DB
    //     const data = new this.typeNewsModel({ typeNameJP, typeNameEN, typeNameCN });
    //     const result = await data.save();
    
    //     // Trả về kết quả dưới dạng object
    //     return result.toObject();
    //   }

    async update(body, _id): Promise<any> {
        const data = await this.typeNewsModel.findByIdAndUpdate(_id, body);
        return data;
    }

    async delete(_id): Promise<any> {
        const data = await this.typeNewsModel.findByIdAndDelete(_id);
        if (!data) {
            throw new NotFoundException('News type not found');
        }
        else{
            const delPr= this.typeNewsModel.findOne({ _id }).lean().exec();
            if(delPr){
                return "Delete success!";
            }
            return "Delete fail!";
        }
       
    }
}
