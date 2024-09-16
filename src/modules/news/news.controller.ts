import { Body, Controller, Delete, HttpStatus, Param, Post, Put, Res} from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './schemas/news.schema';
import { Response } from 'express';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) { }

    //Tìm kiếm
  @Post('get-all')
  async getAll(@Body() pagination: { page: number; size: number; newsCode: string; title: string; typeCode:string; upLoadDate:string }): Promise<{ data: News[], total: number, totalPage: number }> {
    const { page, size, newsCode, title, typeCode, upLoadDate  } = pagination;
    return this.newsService.getAll(page, size, newsCode, title, typeCode, upLoadDate);
  }

  //Tạo mới
  // @Roles('Super admin')
  @Post('add')
  async create(@Body() addNews: { newsCode: string; title: string; thumbnail: string; typeCode: string; upLoadDate: string; content: string; image: string; relatedInformation: string }) {
    return this.newsService.createNews(addNews.newsCode, addNews.title, addNews.thumbnail, addNews.typeCode, addNews.upLoadDate, addNews.content, addNews.image, addNews.relatedInformation);
  }


  @Post('detail/:id')
  async getById(@Param('id') _id: string,
  ): Promise<News> {
    return this.newsService.getById(_id);
  }

  @Put('update/:id')
  async update(
    @Body() body: { newsCode: string; title: string; thumbnail: string; typeCode: string; upLoadDate: string; content: string; image: string; relatedInformation: string } ,
    @Param('id') _id: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.newsService.update(body, _id);
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


  @Delete('delete/:id')
  async delete(
    @Param('id') _id: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.newsService.delete(_id);
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
