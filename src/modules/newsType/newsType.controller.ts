import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request, Res } from '@nestjs/common';
import { NewsTypeService } from './newsType.service';
import { TypeNews } from './schemas/newsType.schema';
import { Response } from 'express';
import { responseData } from 'src/common/responseData.util';

@Controller('newsType')
export class NewsTypeController {
  constructor(private readonly newsTypeService: NewsTypeService) { }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Super admin')
  @Get('get-no-params')
  async getAllNoParams(@Request() req) {
      return this.newsTypeService.getAllNoParams();
  }

  //Tìm kiếm
  @Post('get-all')
  async getAll(@Body() pagination: { page: number; size: number; typeNameJP: string; typeCode: string }): Promise<{ data: TypeNews[], total: number, totalPage: number }> {
    const { page, size, typeNameJP, typeCode } = pagination;
    return this.newsTypeService.getAll(page, size, typeNameJP, typeCode);
  }

  //Tạo mới
  // @Roles('Super admin')
  @Post('add')
  async create(@Body() addNewsType: { typeNameJP: string; typeCode: string }) {
    return this.newsTypeService.createNewsType(addNewsType.typeNameJP, addNewsType.typeCode);
  }
  //  async create(@Body() addNewsType: { typeNameJP: string}) {
  //     return this.newsTypeService.createLoaiTinTuc(addNewsType.typeNameJP);
  // }


  @Post('detail/:id')
  async getById(@Param('id') _id: string,
  ): Promise<TypeNews> {
    return this.newsTypeService.getById(_id);
  }


}


@Controller('newsType/all')
export class NewsTypeControllerAll {
  constructor(private readonly newsTypeService: NewsTypeService) { }
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Super admin')
  // @Get()
  // async getAll(@Request() req) {
  //     return this.newsTypeService.getAll();
  // }

}

@Controller('newsType/update')
export class NewsTypeControllerUpdate {
  constructor(private readonly newsTypeService: NewsTypeService) { }
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Super admin')
  @Put('/:id')
  async update(
    @Body() body: { typeNameJP: string; typeCode: string },
    @Param('id') _id: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.newsTypeService.update(body, _id);
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
}



@Controller('newsType/delete')
export class NewsTypeControllerDelete {
  constructor(private readonly newsTypeService: NewsTypeService) { }
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Super admin')
  @Delete('/:id')
  async delete(
    @Param('id') _id: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.newsTypeService.delete(_id);
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