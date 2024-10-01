import { ApiProperty } from '@nestjs/swagger';

export class CreateTvDto {
    @ApiProperty({ description: 'Mã truyền hình', required: true })
    tvCode: string;
  
    @ApiProperty({ description: 'Tên truyền hình', required: true })
    tvName: string;
  
    @ApiProperty({ description: 'Lịch phát sóng', required: true })
    broadcastTime: string;

    @ApiProperty({ description: 'Mô tả', required: false })
    description:string
  
}

export class SearchTvDto {
    @ApiProperty({ description: 'page', required: true })
    page: number;

    @ApiProperty({ description: 'size', required: true })
    size: number;
  
    @ApiProperty({ description: 'sort', required: false })
    sorts: [string];
  
    @ApiProperty({ description: 'Mã TV', required: false })
    tvCode: string;

    @ApiProperty({ description: 'Tên TV', required: false })
    tvName: string;
  
}


export class ResponseDataDetailTvDto {
    @ApiProperty({ example: 'string' })
    id: string;
  
    @ApiProperty({ description: 'Mã truyền hình', required: false })
    tvCode: string;
  
    @ApiProperty({ description: 'Tên truyền hình', required: false })
    tvName: string;
  
    @ApiProperty({ description: 'Lịch phát sóng', required: false })
    broadcastTime: string;
  
    @ApiProperty({ description: 'Mô tả', required: false })
    description:string
    
  }

export class ResponseSearchTvDto {
    @ApiProperty({ type: [ResponseDataDetailTvDto] })
    data: ResponseDataDetailTvDto[];
  
    @ApiProperty({ example: 0 })
    total: number;
  
    @ApiProperty({ example: 0 })
    totalPage: number;
  }
  