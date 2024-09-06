import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsTypeModule } from './modules/newsType/newsType.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,// Đảm bảo module này đã được import
    NewsTypeModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
