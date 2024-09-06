import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');
  app.setGlobalPrefix("api")
  
  await app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/api`);
  });
}
bootstrap();

