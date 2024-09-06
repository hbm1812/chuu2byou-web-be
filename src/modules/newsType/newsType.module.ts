import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsTypeService } from './newsType.service';
import { NewsTypeController, NewsTypeControllerAll, NewsTypeControllerDelete, NewsTypeControllerUpdate } from './newsType.controller';
import { TypeNews, TypeNewsSchema } from './schemas/newsType.schema';
import { TranslationModule } from '../translation/translation.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: TypeNews.name, schema: TypeNewsSchema }]),
  JwtModule.register({
    secret: 'JWT_SECRET',
    signOptions: { expiresIn: '60m' },
  }),TranslationModule],
  controllers: [NewsTypeController,NewsTypeControllerAll,NewsTypeControllerUpdate, NewsTypeControllerDelete],
  providers: [NewsTypeService],
  exports:[NewsTypeService, JwtModule]
})
export class NewsTypeModule {}
