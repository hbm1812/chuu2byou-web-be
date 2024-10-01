import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TranslationService } from '../translation/translation.service';
import { Tv, TvDocument } from './schemas/tv.schema';




@Injectable()

export class TvService {
  constructor(
    @InjectModel(Tv.name) private readonly tvModel: Model<TvDocument>,
  ) { }


  async getAll(page: number, size: number, tvCode: string, tvName: string): Promise<{ data: Tv[], total: number, totalPage: number }> {
    const skip = page * size;

    // Tạo bộ lọc tìm kiếm với typeNameJP và typeCode
    const filter: any = {};
    if (tvCode) {
      filter.tvCode = { $regex: tvCode, $options: 'i' };
    }
    if (tvName) {
      filter.tvName = { $regex: tvName, $options: 'i' };
    }

    // Tính tổng số bản ghi phù hợp với bộ lọc
    const total = await this.tvModel.countDocuments(filter).exec();

    // Tính tổng số trang
    const totalPage = Math.ceil(total / size);

    // Lấy dữ liệu với phân trang
    const data = await this.tvModel
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




  async create(tvCode: string, tvName: string, broadcastTime:string, description:string): Promise<Tv> {
    // Kiểm tra sự tồn tại của typeCode
    const existingType = await this.tvModel.findOne({ tvCode }).exec();
    if (existingType) {
      throw new BadRequestException('tvCode already exists');
    }

    // Thêm mới nếu typeCode chưa tồn tại
    const tv = new this.tvModel({ tvCode, tvName, broadcastTime, description });
    return tv.save();
  }

  // Hàm tìm kiếm chi tiết theo ID
  async getById(_id): Promise<Tv> {
    const tv = await this.tvModel.findById(_id).exec();
    if (!tv) {
      throw new NotFoundException(`No record found with ID: ${_id}`);
    }
    return tv;
  }



  async update(body: { tvCode: string; tvName: string; broadcastTime: string; description: string }, _id: string): Promise<Tv | null> {
    // Kiểm tra xem `typeCode` đã tồn tại chưa, ngoại trừ bản ghi hiện tại
    const existingTv = await this.tvModel.findOne({ tvCode: body.tvCode, _id: { $ne: _id } }).exec();

    if (existingTv) {
      // Nếu tồn tại, ném lỗi
      throw new ConflictException('typeCode already exists');
    }

    // Cập nhật bản ghi
    const data = await this.tvModel.findByIdAndUpdate(_id, body, { new: true }).exec();
    if (!data) {
      throw new NotFoundException(`No record found with ID: ${_id}`);
    }
    return data;
  }

  async delete(_id: string): Promise<string> {
    // Tìm và xóa bản ghi
    const data = await this.tvModel.findByIdAndDelete(_id).exec();

    // Kiểm tra kết quả xóa
    if (!data) {
      // Nếu không tìm thấy bản ghi để xóa, ném lỗi
      throw new NotFoundException('Data not found');
    }

    // Nếu xóa thành công, trả về thông báo thành công
    return 'Delete successful!';
  }

  
}
