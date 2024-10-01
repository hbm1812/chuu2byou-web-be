import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Works, WorksDocument } from './schemas/works.schema';

@Injectable()
export class WorksService {
    constructor(
        @InjectModel(Works.name) private readonly workModel: Model<WorksDocument>) { }

    async search(page: number, size: number, workCode: string, workName: string): Promise<{ data: Works[], total: number, totalPage: number }> {
        const skip = page * size;

        // Tạo bộ lọc tìm kiếm 
        const filter: any = {};
        if (workCode) {
            filter.workCode = { $regex: workCode, $options: 'i' };
        }
        if (workName) {
            filter.workName = { $regex: workName, $options: 'i' };
        }

        // Tính tổng số bản ghi phù hợp với bộ lọc
        const total = await this.workModel.countDocuments(filter).exec();

        // Tính tổng số trang
        const totalPage = Math.ceil(total / size);

        // Lấy dữ liệu với phân trang
        const data = await this.workModel
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



    async add(workCode: string, workName: string, description: string): Promise<Works> {
        // Kiểm tra sự tồn tại của newsCode
        const existingWork = await this.workModel.findOne({ workCode }).exec();
        if (existingWork) {
            throw new BadRequestException('workCode already exists');
        }

        // Thêm mới nếu newsCode chưa tồn tại
        const newData = new this.workModel({ workCode, workName, description });
        return newData.save();
    }


    // Hàm tìm kiếm chi tiết theo ID
    async getById(_id): Promise<Works> {
        const data = await this.workModel.findById(_id).exec();
        if (!data) {
            throw new NotFoundException(`No record found with ID: ${_id}`);
        }
        return data;
    }


    async update(body: { workCode: string; workName: string; }, _id: string): Promise<Works | null> {
        // Kiểm tra xem `typeCode` đã tồn tại chưa, ngoại trừ bản ghi hiện tại
        const existingData = await this.workModel.findOne({ workCode: body.workCode, _id: { $ne: _id } }).exec();

        if (existingData) {
            // Nếu tồn tại, ném lỗi
            throw new ConflictException('WorkCode already exists');
        }

        // Cập nhật bản ghi
        const data = await this.workModel.findByIdAndUpdate(_id, body, { new: true }).exec();
        if (!data) {
            throw new NotFoundException(`No record found with ID: ${_id}`);
        }
        return data;
    }

    async delete(_id: string): Promise<string> {
        // Tìm và xóa bản ghi
        const data = await this.workModel.findByIdAndDelete(_id).exec();

        // Kiểm tra kết quả xóa
        if (!data) {
            // Nếu không tìm thấy bản ghi để xóa, ném lỗi
            throw new NotFoundException('Data not found');
        }

        // Nếu xóa thành công, trả về thông báo thành công
        return 'Delete successful!';
    }

}
