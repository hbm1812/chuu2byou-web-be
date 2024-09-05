import { Controller, Get, Request } from '@nestjs/common';
import { NewsTypeService } from './newsType.service';
import { TypeNews } from './schemas/newsType.schema';

@Controller('newsType')
export class NewsTypeController {
    constructor(private readonly newsTypeService: NewsTypeService) { }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('Super admin')
    @Get()
    async getAll(@Request() req) {
        return this.newsTypeService.getAll();
    }
}
