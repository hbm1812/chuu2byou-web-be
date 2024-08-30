import { Module } from '@nestjs/common';
import { Type_news, Type_newsSchema } from './schemas/news_type.schema';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsTypeService } from './news_type.service';
import { NewsTypeController } from './news_type.controller';
@Module({
  imports: [MongooseModule.forFeature([{ name: Type_news.name, schema: Type_newsSchema }]),
  JwtModule.register({
    secret: 'JWT_SECRET',
    signOptions: { expiresIn: '60m' },
  }),],
  controllers: [NewsTypeController],
  providers: [NewsTypeService],
  exports:[NewsTypeService, JwtModule]
})
export class NewsTypeModule {}
