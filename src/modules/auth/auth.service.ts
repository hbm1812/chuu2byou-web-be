import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from '../users/schemas/users.schemas';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async login(username: string, password: string): Promise<{ token: string }> {
    // Tìm người dùng trong cơ sở dữ liệu dựa trên tên đăng nhập
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Username does not exists');
    }

    // Kiểm tra mật khẩu có khớp hay không
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Wrong password');
    }

    // Tạo JWT token
    const payload = { userId: user._id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token };
  }

  // Hàm profile lấy thông tin người dùng
  async profile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).select('-password'); // Không trả về trường password

    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }

    return user;
  }
 
}
