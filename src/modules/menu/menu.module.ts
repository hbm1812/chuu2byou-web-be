import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Menu, MenuSchema } from './schemas/menu.schema';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '60m' },
    })],
    controllers: [MenuController],
    providers: [MenuService],
    exports:[MenuService, JwtModule]
  })
  export class MenuModule {}