import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { GlobalMenu } from './schemas/menu.schema';
import { Response } from 'express';

@Controller('security')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('authenticate')
  async login(@Body() auth: { username: string; password: string; }) {
    return this.authService.login(auth.username, auth.password)
  }


  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async getProfile(@Request() req) {
    return this.authService.profile(req.user.userId);
  }


  @Post('menu')
  getMenu() {
    return this.authService.getMenu();
  }

  

  @Post('globalMenu/search')
  async getGlobalMenus(@Body() pagination: { page: number; size: number; key: string; name: string }):  Promise<{ data: GlobalMenu[], total: number, totalPage: number }> {
    const { page, size, key, name } = pagination;
    return this.authService.getHierarchicalGlobalMenu(page, size, key, name );
  }

  @Post('globalMenu/add')
  async createGlobalMenu(@Body() menuData: { key:string; code: string; parentCode: string; name: string; path: string; icon: string; landing: number; showMenu:number; children:GlobalMenu[] }){
    // console.log(menuData)
    return this.authService.addGlobalMenu(menuData);
  }


  @Post('globalMenu/detail/:id')
  async getById(@Param('id') _id: string,
  ): Promise<GlobalMenu> {
    return this.authService.getGlobalMenuById(_id);
  }


  @Put('globalMenu/update/:id')
  async updateGlobalMenu(
    @Body() body: { key: string; code: string; parentCode: string; name: string; path: string; icon: string; landing: number; showMenu: number; children: GlobalMenu[] } ,
    @Param('id') _id: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.authService.updateGlobalMenu(body, _id);
      if (result) {
        return res.status(HttpStatus.OK).json({
          message: 'Cập nhật thành công',
          data: result,
        });
      }
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
        error: err.message,
      });
    }
  }

  @Delete('globalMenu/delete/:id')
  async delete(
    @Param('id') _id: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.authService.deleteGlobalMenu(_id);
      return res.status(HttpStatus.OK).json({
        message: result,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
  
}
