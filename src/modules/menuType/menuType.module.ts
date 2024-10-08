import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MenuType, MenuTypeSchema } from "./schemas/menuType.shema";
import { JwtModule } from "@nestjs/jwt";
import { MenuTypeController } from "./menuType.controller";
import { MenuTypeService } from "./menuType.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: MenuType.name, schema: MenuTypeSchema }]),
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '60m' },
    })],
    controllers: [MenuTypeController],
    providers: [MenuTypeService],
    exports:[MenuTypeService, JwtModule]
  })
  export class MenuTypeModule {}