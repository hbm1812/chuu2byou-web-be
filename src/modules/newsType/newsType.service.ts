import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TypeNews, TypeNewsDocument } from './schemas/newsType.schema';
import { TranslationService } from '../translation/translation.service';




@Injectable()

export class NewsTypeService {
  constructor(
    @InjectModel(TypeNews.name) private readonly typeNewsModel: Model<TypeNewsDocument>,
    private readonly translationService: TranslationService,  // Inject TranslationService
  ) { }


  async getAllNoParams(): Promise<TypeNews[]> {
      return this.typeNewsModel.find().exec();
  }
  
  async getAll(page: number, size: number, typeNameJP: string, typeCode: string): Promise<{ data: TypeNews[], total: number, totalPage: number }> {
    const skip = page * size;

    // Tạo bộ lọc tìm kiếm với typeNameJP và typeCode
    const filter: any = {};
    if (typeNameJP) {
      filter.typeNameJP = { $regex: typeNameJP, $options: 'i' };
    }
    if (typeCode) {
      filter.typeCode = { $regex: typeCode, $options: 'i' };
    }

    // Tính tổng số bản ghi phù hợp với bộ lọc
    const total = await this.typeNewsModel.countDocuments(filter).exec();

    // Tính tổng số trang
    const totalPage = Math.ceil(total / size);

    // Lấy dữ liệu với phân trang
    const data = await this.typeNewsModel
      .find(filter)
      .skip(skip)
      .limit(size)
      .exec();

    // Trả về kết quả theo định dạng yêu cầu
    return {
      data,
      total,
      totalPage,
    };
  }



  async createNewsType(typeNameJP: string, typeCode: string): Promise<TypeNews> {
    // Kiểm tra sự tồn tại của typeCode
    const existingType = await this.typeNewsModel.findOne({ typeCode }).exec();
    if (existingType) {
      throw new BadRequestException('typeCode already exists');
    }

    // Thêm mới nếu typeCode chưa tồn tại
    const newTypeNews = new this.typeNewsModel({ typeNameJP, typeCode });
    return newTypeNews.save();
  }

  // Hàm tìm kiếm chi tiết theo ID
  async getById(_id): Promise<TypeNews> {
    const typeNews = await this.typeNewsModel.findById(_id).exec();
    if (!typeNews) {
      throw new NotFoundException(`No record found with ID: ${_id}`);
    }
    return typeNews;
  }


  // async createLoaiTinTuc(typeNameJP: string ): Promise<any> {
  //     const data = new this.typeNewsModel({ typeNameJP });
  //     const result = await data.save();
  //     const Obj = result.toObject();
  //     return Obj;
  // }

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

  async update(body: { typeNameJP: string; typeCode: string }, _id: string): Promise<TypeNews | null> {
    // Kiểm tra xem `typeCode` đã tồn tại chưa, ngoại trừ bản ghi hiện tại
    const existingTypeNews = await this.typeNewsModel.findOne({ typeCode: body.typeCode, _id: { $ne: _id } }).exec();

    if (existingTypeNews) {
      // Nếu tồn tại, ném lỗi
      throw new ConflictException('typeCode already exists');
    }

    // Cập nhật bản ghi
    const data = await this.typeNewsModel.findByIdAndUpdate(_id, body, { new: true }).exec();
    if (!data) {
      throw new NotFoundException(`No record found with ID: ${_id}`);
    }
    return data;
  }

  async delete(_id: string): Promise<string> {
    // Tìm và xóa bản ghi
    const data = await this.typeNewsModel.findByIdAndDelete(_id).exec();

    // Kiểm tra kết quả xóa
    if (!data) {
      // Nếu không tìm thấy bản ghi để xóa, ném lỗi
      throw new NotFoundException('Data not found');
    }

    // Nếu xóa thành công, trả về thông báo thành công
    return 'Delete successful!';
  }
}
