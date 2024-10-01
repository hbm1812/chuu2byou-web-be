import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');
  app.setGlobalPrefix("api")

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


   // Cấu hình giới hạn kích thước tải lên
   app.use(bodyParser.json({ limit: '20mb' }));
   app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
  await app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/api`);
    console.log(`Swagger is available at http://localhost:${port}/api/docs`);
  });
}
bootstrap();

