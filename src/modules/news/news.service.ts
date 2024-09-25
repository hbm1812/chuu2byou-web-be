import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { News, NewsDocument } from './schemas/news.schema';
import { Model } from 'mongoose';

@Injectable()
export class NewsService {
    constructor(
        @InjectModel(News.name) private readonly newsModel: Model<NewsDocument>) { }
        

    async getAll(page: number, size: number, newsCode: string, title: string, typeCode: string, upLoadDate: string): Promise<{ data: News[], total: number, totalPage: number }> {
        const skip = page * size;

        // Tạo bộ lọc tìm kiếm 
        const filter: any = {};
        if (newsCode) {
            filter.newsCode = { $regex: newsCode, $options: 'i' };
        }
        if (typeCode) {
            filter.typeCode = { $regex: typeCode, $options: 'i' };
        }
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }
        if (upLoadDate) {
            filter.upLoadDate = { $regex: upLoadDate, $options: 'i' };
        }

        // Tính tổng số bản ghi phù hợp với bộ lọc
        const total = await this.newsModel.countDocuments(filter).exec();

        // Tính tổng số trang
        const totalPage = Math.ceil(total / size);

        // Lấy dữ liệu với phân trang
        const data = await this.newsModel
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


    async createNews(newsCode: string, title: string, thumbnail: string, typeCode: string, upLoadDate: string, content: string, relatedInformation: string): Promise<News> {
        // Kiểm tra sự tồn tại của newsCode
        const existingType = await this.newsModel.findOne({ newsCode }).exec();
        if (existingType) {
            throw new BadRequestException('newsCode already exists');
        }

        // Thêm mới nếu newsCode chưa tồn tại
        const newData = new this.newsModel({ newsCode, title, thumbnail, typeCode, upLoadDate, content,  relatedInformation });
        return newData.save();
    }

    // Hàm tìm kiếm chi tiết theo ID
    async getById(_id): Promise<News> {
        const news = await this.newsModel.findById(_id).exec();
        if (!news) {
            throw new NotFoundException(`No record found with ID: ${_id}`);
        }
        return news;
    }



    async update(body: { newsCode: string, title: string, thumbnail: string, typeCode: string, upLoadDate: string, content: string, relatedInformation: string }, _id: string): Promise<News | null> {
        // Kiểm tra xem `newsCode` đã tồn tại chưa, ngoại trừ bản ghi hiện tại
        const existingNews = await this.newsModel.findOne({ newsCode: body.newsCode, _id: { $ne: _id } }).exec();

        if (existingNews) {
            // Nếu tồn tại, ném lỗi
            throw new ConflictException('typeCode already exists');
        }

        // Cập nhật bản ghi
        const data = await this.newsModel.findByIdAndUpdate(_id, body, { new: true }).exec();
        if (!data) {
            throw new NotFoundException(`No record found with ID: ${_id}`);
        }
        return data;
    }

    async delete(_id: string): Promise<string> {
        // Tìm và xóa bản ghi
        const data = await this.newsModel.findByIdAndDelete(_id).exec();

        // Kiểm tra kết quả xóa
        if (!data) {
            // Nếu không tìm thấy bản ghi để xóa, ném lỗi
            throw new NotFoundException('News type not found');
        }

        // Nếu xóa thành công, trả về thông báo thành công
        return 'Delete successful!';
    }


}
