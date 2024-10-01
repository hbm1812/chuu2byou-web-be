// create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'Username', required: true })
    username: string;
  
    @ApiProperty({ description: 'Password', required: true })
    password: string;
  
    @ApiProperty({ description: 'Full Name', required: true })
    fullName: string;
  
    @ApiProperty({ description: 'Gender', required: false })
    gender: number;
  
    @ApiProperty({ description: 'Email', required: true })
    email: string;
  
    @ApiProperty({ description: 'Admin', required: true })
    admin: boolean;
  
    @ApiProperty({ description: 'Account Level', required: true })
    accountLevel: number;
  
    @ApiProperty({ description: 'Roles', required: false, isArray: true })
    roles: string[];
}


export class SearchuserDto {
    @ApiProperty({ description: 'page', required: true })
    page: number;

    @ApiProperty({ description: 'size', required: true })
    size: number;
  
    @ApiProperty({ description: 'sort', required: false })
    sorts: [string];
  
    @ApiProperty({ description: 'Username', required: false })
    username: string;

    @ApiProperty({ description: 'full name', required: false })
    fullName: string;

    @ApiProperty({ description: 'Roles', required: false, isArray: true })
    roles: string[];

    @ApiProperty({ description: 'account lv', required: false })
    accountLevel: string;
  
}

export class UserDataSearchDto {
    @ApiProperty({ example: 'string' })
    id: string;
  
    @ApiProperty({ description: 'Username', required: true })
    username: string;
  
  
    @ApiProperty({ description: 'Full Name', required: true })
    fullName: string;
  
    @ApiProperty({ description: 'Gender', required: false })
    gender: number;
  
  
    @ApiProperty({ description: 'Admin', required: true })
    admin: boolean;
  
    @ApiProperty({ description: 'Account Level', required: true })
    accountLevel: number;
  
    @ApiProperty({ description: 'Roles', required: false, isArray: true })
    roles: string[];
  
    
  }


  export class ResponseSearchUserDto {
    @ApiProperty({ type: [UserDataSearchDto] })
    data: UserDataSearchDto[];
  
    @ApiProperty({ example: 0 })
    total: number;
  
    @ApiProperty({ example: 0 })
    totalPage: number;
  }

  
  export class ResponseDataDetailUserDto {
    @ApiProperty({ description: 'id Công việc', example: 'string', required: false })
    id: string;
  
    @ApiProperty({ description: 'Username', required: true })
    username: string;
  
    @ApiProperty({ description: 'Password', required: true })
    password: string;
  
    @ApiProperty({ description: 'Full Name', required: true })
    fullName: string;
  
    @ApiProperty({ description: 'Gender', required: false })
    gender: number;
  
    @ApiProperty({ description: 'Email', required: true })
    email: string;
  
    @ApiProperty({ description: 'Admin', required: true })
    admin: boolean;
  
    @ApiProperty({ description: 'Account Level', required: true })
    accountLevel: number;
  
    @ApiProperty({ description: 'Roles', required: false, isArray: true })
    roles: string[];
    
  }
