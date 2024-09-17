import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { responseData } from 'src/common/responseData.util';
import { Tv } from './schemas/tv.schema';
import { TvService } from './tv.service';

@Controller('tv')
export class TvController {
  constructor(private readonly tvService: TvService) { }

  //Tìm kiếm
  @Post('get-all')
  async getAll(@Body() pagination: { page: number; size: number; tvCode: string; tvName: string }): Promise<{ data: Tv[], total: number, totalPage: number }> {
    const { page, size, tvCode, tvName } = pagination;
    return this.tvService.getAll(page, size, tvCode, tvName);
  }

  //Tạo mới
  // @Roles('Super admin')
  @Post('add')
  async create(@Body() addTV: { tvCode: string; tvName: string; broadcastTime: string; description: string }) {
    return this.tvService.create(addTV.tvCode, addTV.tvName, addTV.broadcastTime, addTV.description);
  }


  @Post('detail/:id')
  async getById(@Param('id') _id: string,
  ): Promise<Tv> {
    return this.tvService.getById(_id);
  }


}




@Controller('tv/update')
export class ControllerUpdate {
  constructor(private readonly tvService: TvService) { }
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Super admin')
  @Put('/:id')
  async update(
    @Body() body: { tvCode: string; tvName: string; broadcastTime: string; description: string },
    @Param('id') _id: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.tvService.update(body, _id);
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



@Controller('tv/delete')
export class ControllerDelete {
  constructor(private readonly tvService: TvService) { }
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Super admin')
  @Delete('/:id')
  async delete(
    @Param('id') _id: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.tvService.delete(_id);
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