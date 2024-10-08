import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request, Res } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { Menu } from "./schema/menu.schema";
import { Response } from 'express';
@Controller('security')
export class MenuController {
  constructor(private readonly service: MenuService) { } 

 

  @Post('menu/search')
  async searchMenu(@Body() pagination: { page: number; size: number; key: string; name: string }):  Promise<{ data: Menu[], total: number, totalPage: number }> {
    const { page, size, key, name } = pagination;
    return this.service.getHierarchicalMenu(page, size, key, name );
  }

  
  @Post('menu/add')
  async createMenu(@Body() menuData: { key:string; code: string; parentCode: string; name: string; path: string; icon: string; landing: number; showMenu:number; menuTypeCode:string; menuLevel:number; children:Menu[] }){
    // console.log(menuData)
    return this.service.addMenu(menuData);
  }

  
  @Post('menu/detail/:id')
  async getById(@Param('id') _id: string,
  ): Promise<Menu> {
    return this.service.getMenuById(_id);
  }

  @Put('menu/update/:id')
  async updateGlobalMenu(
    @Body() body: { key: string; code: string; parentCode: string; name: string; path: string; icon: string; landing: number; showMenu: number;  menuTypeCode:string; menuLevel:number;  children: Menu[] } ,
    @Param('id') _id: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.service.updateMenu(body, _id);
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

  @Delete('menu/delete/:id')
  async delete(
    @Param('id') _id: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.service.deleteMenu(_id);
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