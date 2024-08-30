import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsTypeModule } from './news_type/news_type.module';
import { NewsTypeModule } from './news_type/news_type.module';

@Module({
  imports: [NewsTypeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
