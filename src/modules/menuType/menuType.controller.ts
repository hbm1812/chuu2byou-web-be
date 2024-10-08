import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request, Res } from "@nestjs/common";
import { MenuTypeService } from "./menuType.service";
import { MenuType } from "./schemas/menuType.shema";
import { Response } from 'express';
@Controller('security')
export class MenuTypeController {
  constructor(private readonly service: MenuTypeService) { }


  @Get('menuType/get-menuType-no-params')
  async getAllNoParams(@Request() req) {
      return this.service.getAllMenuTypeNoParams();
  }

 //Tìm kiếm
 @Post('menuType/search')
 async getAll(@Body() pagination: { page: number; size: number; menuTypeName: string; menuTypeCode: string }): Promise<{ data: MenuType[], total: number, totalPage: number }> {
   const { page, size, menuTypeName, menuTypeCode } = pagination;
   return this.service.search(page, size, menuTypeName, menuTypeCode);
 }

 @Post('menuType/add')
 async create(@Body() addNewsType: { menuTypeName: string; menuTypeCode: string }) {
   return this.service.create(addNewsType.menuTypeName, addNewsType.menuTypeCode);
 }

 @Post('menuType/detail/:id')
 async getById(@Param('id') _id: string,
 ): Promise<MenuType> {
   return this.service.getById(_id);
 }

 @Put('menuType/update/:id')
 async update(
   @Body() body: { menuTypeName: string; menuTypeCode: string },
   @Param('id') _id: string,
   @Res() res: Response,
 ) {
   try {
     const result = await this.service.update(body, _id);
     if (result) {
       return res.status(HttpStatus.OK).json({
         message: 'Updated successfully',
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

 @Delete('menuType/delete/:id')
  async delete(
    @Param('id') _id: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.service.delete(_id);
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