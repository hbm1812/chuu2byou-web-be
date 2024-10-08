import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MenuType, MenuTypeDocument } from "./schemas/menuType.shema";
import { Model } from "mongoose";

@Injectable()

export class MenuTypeService {
  constructor(
    @InjectModel(MenuType.name) private readonly model: Model<MenuTypeDocument>,// Inject TranslationService
  ) { }


  async getAllMenuTypeNoParams(): Promise<MenuType[]> {
    return this.model.find().exec();
}

  async search(page: number, size: number, menuTypeName: string, menuTypeCode: string): Promise<{ data: MenuType[], total: number, totalPage: number }> {
    const skip = page * size;

    // Tạo bộ lọc tìm kiếm với
    const filter: any = {};
    if (menuTypeName) {
      filter.menuTypeName = { $regex: menuTypeName, $options: 'i' };
    }
    if (menuTypeCode) {
      filter.menuTypeCode = { $regex: menuTypeCode, $options: 'i' };
    }

    // Tính tổng số bản ghi phù hợp với bộ lọc
    const total = await this.model.countDocuments(filter).exec();

    // Tính tổng số trang
    const totalPage = Math.ceil(total / size);

    // Lấy dữ liệu với phân trang
    const data = await this.model
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


  
  async create(menuTypeName: string, menuTypeCode: string): Promise<MenuType> {
    // Kiểm tra sự tồn tại của typeCode
    const existingType = await this.model.findOne({ menuTypeCode }).exec();
    if (existingType) {
      throw new BadRequestException('menuTypeCode already exists');
    }

    // Thêm mới nếu typeCode chưa tồn tại
    const newData= new this.model({ menuTypeName, menuTypeCode });
    return newData.save();
  }

  // Hàm tìm kiếm chi tiết theo ID
  async getById(_id): Promise<MenuType> {
    const data = await this.model.findById(_id).exec();
    if (!data) {
      throw new NotFoundException(`No record found with ID: ${_id}`);
    }
    return data;
  }


  async update(body: { menuTypeName: string; menuTypeCode: string }, _id: string): Promise<MenuType | null> {
    // Kiểm tra xem `typeCode` đã tồn tại chưa, ngoại trừ bản ghi hiện tại
    const existingTypeNews = await this.model.findOne({ menuTypeCode: body.menuTypeCode, _id: { $ne: _id } }).exec();

    if (existingTypeNews) {
      // Nếu tồn tại, ném lỗi
      throw new ConflictException('typeCode already exists');
    }

    // Cập nhật bản ghi
    const data = await this.model.findByIdAndUpdate(_id, body, { new: true }).exec();
    if (!data) {
      throw new NotFoundException(`No record found with ID: ${_id}`);
    }
    return data;
  }

  async delete(_id: string): Promise<string> {
    // Tìm và xóa bản ghi
    const data = await this.model.findByIdAndDelete(_id).exec();

    // Kiểm tra kết quả xóa
    if (!data) {
      // Nếu không tìm thấy bản ghi để xóa, ném lỗi
      throw new NotFoundException('Data not found');
    }

    // Nếu xóa thành công, trả về thông báo thành công
    return 'Delete successful!';
  }

}