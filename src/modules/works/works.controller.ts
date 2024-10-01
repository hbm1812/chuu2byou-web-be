import { Body, Controller, Delete, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';

import { Response } from 'express';
import { Works } from './schemas/works.schema';
import { WorksService } from './works.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateWorkDto, ResponseDataDetailWorkDto, ResponseSearchWorkDto, SearchWorkDto } from 'src/Dto/works.dto';

@ApiTags('Works') // Nhóm API thành "Works"
@Controller('staffCast')
export class WorksController {
    constructor(private readonly workService: WorksService) { }

    // Tìm kiếm
    @Post('works/search')
    @ApiOperation({ summary: 'Tìm kiếm công việc' })
    @ApiResponse({ status: 200, description: 'Danh sách công việc được trả về.', type:ResponseSearchWorkDto })
    @ApiBody({ type: SearchWorkDto })
    async getAll(
        @Body() pagination: { page: number; size: number; workCode: string; workName: string }
    ): Promise<{ data: Works[]; total: number; totalPage: number }> {
        const { page, size, workCode, workName } = pagination;
        return this.workService.search(page, size, workCode, workName);
    }




    @Post('works/add')
    @ApiOperation({ summary: 'Thêm công việc mới' })
    @ApiResponse({ status: 201, description: 'Công việc được tạo thành công.', type:ResponseDataDetailWorkDto })
    @ApiBody({ type: CreateWorkDto })
    async create(@Body() add: { workCode: string; workName: string; description: string }) {
        return this.workService.add(add.workCode, add.workName, add.description);
    }


    @Post('works/detail/:id')
    @ApiOperation({ summary: 'Lấy chi tiết công việc theo ID' })
    @ApiResponse({ status: 200, description: 'Chi tiết công việc được trả về.',  type:ResponseDataDetailWorkDto})  
    @ApiParam({ name: 'id', type: 'string', description: 'ID của công việc', example: '6123abc456def78901234xyz' })
    async getById(@Param('id') _id: string,
    ): Promise<Works> {
        return this.workService.getById(_id);
    }


    @Put('works/update/:id')
    @ApiOperation({ summary: 'Cập nhật công việc theo ID' })
    @ApiResponse({ status: 200, description: 'Công việc được cập nhật thành công.' , type:ResponseDataDetailWorkDto})
    @ApiParam({ name: 'id', type: 'string', description: 'ID của công việc', example: '6123abc456def78901234xyz' })
    @ApiBody({type: CreateWorkDto} )
    async update(
        @Body() body: { workCode: string; workName: string; },
        @Param('id') _id: string,
        @Res() res: Response,
    ) {
        try {
            const result = await this.workService.update(body, _id);
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


    @Delete('works/delete/:id')
    @ApiOperation({ summary: 'Xóa công việc theo ID' })
    @ApiResponse({ status: 200, description: 'Công việc đã được xóa thành công.' })
    @ApiParam({ name: 'id', type: 'string', description: 'ID của công việc', example: '6123abc456def78901234xyz' })
    async delete(
        @Param('id') _id: string,
        @Res() res: Response,
    ) {
        try {
            const result = await this.workService.delete(_id);
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