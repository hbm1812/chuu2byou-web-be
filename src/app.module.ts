import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsTypeModule } from './modules/newsType/newsType.module';
import { NewsModule } from './modules/news/news.module';

@Module({
  imports: [NewsTypeModule,NewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
