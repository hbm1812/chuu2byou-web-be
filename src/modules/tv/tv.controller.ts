import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { responseData } from 'src/common/responseData.util';
import { Tv } from './schemas/tv.schema';
import { TvService } from './tv.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTvDto, ResponseDataDetailTvDto, ResponseSearchTvDto, SearchTvDto } from 'src/Dto/tv.dto';

@ApiTags('Tv broadcast') // Nhóm API thành "Works"
@Controller('category/tv')
export class TvController {
  constructor(private readonly tvService: TvService) { }

  //Tìm kiếm
  @Post('get-all')
  @ApiOperation({ summary: 'Tìm kiếm tv' })
  @ApiResponse({ status: 200, description: 'Danh sách tv được trả về.', type: ResponseSearchTvDto })
  @ApiBody({ type: SearchTvDto })
  async getAll(@Body() pagination: { page: number; size: number; tvCode: string; tvName: string }): Promise<{ data: Tv[], total: number, totalPage: number }> {
    const { page, size, tvCode, tvName } = pagination;
    return this.tvService.getAll(page, size, tvCode, tvName);
  }

  //Tạo mới
  // @Roles('Super admin')
  @Post('add')
  @ApiOperation({ summary: 'Thêm mới' })
  @ApiResponse({ status: 201, description: 'thành công.', type: ResponseDataDetailTvDto })
  @ApiBody({ type: CreateTvDto })
  async create(@Body() addTV: { tvCode: string; tvName: string; broadcastTime: string; description: string }) {
    return this.tvService.create(addTV.tvCode, addTV.tvName, addTV.broadcastTime, addTV.description);
  }


  @Post('detail/:id')
  @ApiOperation({ summary: 'Tìm theo ID' })
  @ApiResponse({ status: 200, description: 'Chi tiết công việc được trả về.', type: ResponseDataDetailTvDto })
  @ApiParam({ name: 'id', type: 'string', description: 'ID của tv', example: '6123abc456def78901234xyz' })
  async getById(@Param('id') _id: string,
  ): Promise<Tv> {
    return this.tvService.getById(_id);
  }





  @Put('update/:id')
  @ApiOperation({ summary: 'Cập nhật công việc theo ID' })
  @ApiResponse({ status: 200, description: 'Công việc được cập nhật thành công.' , type:ResponseDataDetailTvDto})
  @ApiParam({ name: 'id', type: 'string', description: 'ID của công việc', example: '6123abc456def78901234xyz' })
  @ApiBody({type: CreateTvDto} )
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






  @Delete('delete/:id')
  @ApiOperation({ summary: 'Xóa công việc theo ID' })
    @ApiResponse({ status: 200, description: 'Công việc đã được xóa thành công.' })
    @ApiParam({ name: 'id', type: 'string', description: 'ID của công việc', example: '6123abc456def78901234xyz' })
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