import { Body, Controller, Get, Post,Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/users.schemas';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, ResponseDataDetailUserDto, ResponseSearchUserDto, SearchuserDto } from 'src/Dto/user.dto';
import { ResponseSearchWorkDto } from 'src/Dto/works.dto';

@ApiTags('Users') // Nhóm các endpoint dưới nhóm 'Users'
@Controller('security/users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }


    //Tạo mới
    // @Roles('Super admin')
    @Post('add')
    @ApiOperation({ summary: 'Tạo người dùng mới' }) // Mô tả ngắn gọn về API
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'Người dùng đã được tạo thành công', type:ResponseDataDetailUserDto })
    @ApiResponse({ status: 400, description: 'Thông tin không hợp lệ' })
    async create(@Body() addUser: { username: string; password: string; fullName: string; gender: number; email: string; admin: boolean; accountLevel: number; roles: string[] }) {
        return this.userService.create(addUser.username, addUser.password, addUser.fullName, addUser.gender, addUser.email, addUser.admin, addUser.accountLevel, addUser.roles)
    }

     // Lấy danh sách tất cả người dùng
     @Get('get-all')
     @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng' })
     @ApiResponse({ status: 200, description: 'Danh sách người dùng trả về thành công',  type:ResponseDataDetailUserDto })
    async getAllNoParams(@Request() req) {
        return this.userService.getAllNoParams();
    }


     //Tìm kiếm
     @Post('search')
     @ApiOperation({ summary: 'Tìm kiếm người dùng theo các tiêu chí' })
     @ApiBody({type:SearchuserDto})
     @ApiResponse({ status: 200, description: 'Danh sách người dùng trả về thành công', type:ResponseSearchUserDto })
     async search(@Body() pagination: { page: number; size: number; sorts:string[]; username: string; fullName: string; roles:string[]; accountLevel:number }): Promise<{ data: User[], total: number, totalPage: number }> {
       const { page, size, sorts, username, fullName, roles, accountLevel  } = pagination;
       return this.userService.search(page, size, sorts, username, fullName, roles, accountLevel);
     }
  
}
