import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsTypeModule } from './modules/newsType/newsType.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { NewsModule } from './modules/news/news.module';
import { UploadModule } from './modules/upload/upload.module';
import { TvModule } from './modules/tv/tv.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Để biến môi trường có thể được truy cập toàn cục
    }),
    DatabaseModule,// Đảm bảo module này đã được import
    NewsTypeModule, 
    NewsModule,
    UsersModule,
    UploadModule,
    TvModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
