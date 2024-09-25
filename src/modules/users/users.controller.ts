import { Body, Controller, Get, Post,Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/users.schemas';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }


    //Tạo mới
    // @Roles('Super admin')
    @Post('add')
    async create(@Body() addUser: { username: string; password: string; fullName: string; gender: number; email: string; admin: boolean; accountLevel: number; roles: string[] }) {
        return this.userService.create(addUser.username, addUser.password, addUser.fullName, addUser.gender, addUser.email, addUser.admin, addUser.accountLevel, addUser.roles)
    }

    //Tìm kiếm
    @Get('get-all')
    async getAllNoParams(@Request() req) {
        return this.userService.getAllNoParams();
    }

     //Tìm kiếm
     @Post('search')
     async search(@Body() pagination: { page: number; size: number; sorts:string[]; username: string; fullName: string; roles:string[]; accountLevel:number }): Promise<{ data: User[], total: number, totalPage: number }> {
       const { page, size, sorts, username, fullName, roles, accountLevel  } = pagination;
       return this.userService.search(page, size, sorts, username, fullName, roles, accountLevel);
     }
  
}
