import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsTypeModule } from './modules/newsType/newsType.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { NewsModule } from './modules/news/news.module';
import { UploadModule } from './modules/upload/upload.module';
import { TvModule } from './modules/tv/tv.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { WorksModule } from './modules/works/works.module';
import { MenuModule } from './modules/menu/menu.module';


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
    AuthModule,
    WorksModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
