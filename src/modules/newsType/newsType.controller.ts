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
    @Get()
    async getAll(@Request() req) {
        return this.newsTypeService.getAll();
    }

    //Tạo mới
     // @Roles('Super admin')
     @Post()
     async create(@Body() addNewsType: { typeNameJP: string}) {
         return this.newsTypeService.createLoaiTinTuc(addNewsType.typeNameJP);
     }
    //  async create(@Body() addNewsType: { typeNameJP: string}) {
    //     return this.newsTypeService.createLoaiTinTuc(addNewsType.typeNameJP);
    // }
 
}


@Controller('newsType/all')
export class NewsTypeControllerAll {
    constructor(private readonly newsTypeService: NewsTypeService) { }
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('Super admin')
    @Get()
    async getAll(@Request() req) {
        return this.newsTypeService.getAll();
    }
}


@Controller('newsType/update')
export class NewsTypeControllerUpdate {
    constructor(private readonly newsTypeService: NewsTypeService) { }
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('Super admin')
    @Put('/:id')
    async update(
        @Body() body: { typeNameJP: string; typeNameEN: string },
        @Param('id') _id:string,
        @Res() res: Response,
      ) {
    
        try {
          const result = await this.newsTypeService.update(body, _id);
          return responseData(res, result, HttpStatus.OK, 'Success');
        } catch (err) {
          return responseData(res, null, HttpStatus.BAD_REQUEST, err.message);
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
        @Param('id') _id:string,
        @Res() res: Response,
      ) {
    
        try {
          const result = await this.newsTypeService.delete( _id);
          return responseData(res, result, HttpStatus.OK, 'Success');
        } catch (err) {
          return responseData(res, null, HttpStatus.BAD_REQUEST, err.message);
        }
      }
}