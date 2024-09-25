import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schemas';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) { }

    async create(username: string, password: string, fullName: string, gender: number, email: string, admin: boolean, accountLevel: number, roles: string[]): Promise<User> {
        // Kiểm tra sự tồn tại của email và username
        const existingEmail = await this.userModel.findOne({ email }).exec();
        const existingUsername = await this.userModel.findOne({ username }).exec();
        
        if (existingEmail) {
            throw new BadRequestException('Email already exists');
        }
        if (existingUsername) {
            throw new BadRequestException('Username already exists');
        }
    
        // Mã hóa mật khẩu trước khi lưu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        // Tạo mới user với mật khẩu đã mã hóa
        const userNew = new this.userModel({
            username,
            password: hashedPassword, // Lưu mật khẩu đã mã hóa
            fullName,
            gender,
            email,
            admin,
            accountLevel,
            roles
        });
        
        return userNew.save();
    }

    async getAllNoParams(): Promise<User[]> {
        return this.userModel.find().exec();
    }


    async search(page: number, size: number,sorts:string[], username: string, fullName: string, roles: string[], accountLevel: number): Promise<{ data: User[], total: number, totalPage: number }> {
        const skip = page * size;

        // Tạo bộ lọc tìm kiếm 
        const filter: any = {};
        if (username) {
            filter.username = { $regex: username, $options: 'i' };
        }
        if (fullName) {
            filter.fullName = { $regex: fullName, $options: 'i' };
        }
        if (roles) {
            filter.title = { $regex: roles, $options: 'i' };
        }
        if (accountLevel) {
            filter.upLoadDate = { $regex: accountLevel, $options: 'i' };
        }

        // Tính tổng số bản ghi phù hợp với bộ lọc
        const total = await this.userModel.countDocuments(filter).exec();

        // Tính tổng số trang
        const totalPage = Math.ceil(total / size);

        // Lấy dữ liệu với phân trang
        const data = await this.userModel
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


}



