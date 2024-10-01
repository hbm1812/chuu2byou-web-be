// create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkDto {
    @ApiProperty({ description: 'Mã công việc', required: true })
    workCode: string;
  
    @ApiProperty({ description: 'Tên công việc', required: true })
    workName: string;
  
    @ApiProperty({ description: 'Mô tả', required: false })
    description: string;
  
}


export class SearchWorkDto {
    @ApiProperty({ description: 'page', required: true })
    page: number;

    @ApiProperty({ description: 'size', required: true })
    size: number;
  
    @ApiProperty({ description: 'sort', required: false })
    sorts: [string];
  
    @ApiProperty({ description: 'Mã công việc', required: false })
    workCode: string;

    @ApiProperty({ description: 'Tên công việc', required: false })
    workName: string;
  
}


export class WorkDataSearchDto {
  @ApiProperty({ example: 'string' })
  id: string;

  @ApiProperty({ example: 'string' })
  workCode: string;

  @ApiProperty({ example: 'string' })
  workName: string;

  
}

export class ResponseSearchWorkDto {
  @ApiProperty({ type: [WorkDataSearchDto] })
  data: WorkDataSearchDto[];

  @ApiProperty({ example: 0 })
  total: number;

  @ApiProperty({ example: 0 })
  totalPage: number;
}


export class ResponseDataDetailWorkDto {
    @ApiProperty({ description: 'id Công việc', example: 'string', required: false })
    id: string;
  
    @ApiProperty({ description: 'Mã công việc',example: 'string', required: false })
    workCode: string;
  
    @ApiProperty({description: 'TênCông việc', example: 'string', required: false })
    workName: string;
  
    @ApiProperty({description: 'Mô tả', example: 'string', required: false })
    description: string;
    
  }


  