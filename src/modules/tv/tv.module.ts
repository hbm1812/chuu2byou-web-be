import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ControllerDelete, ControllerUpdate, TvController } from './tv.controller';
import { Tv, TvSchema } from './schemas/tv.schema';
import { TvService } from './tv.service';
@Module({
  imports: [MongooseModule.forFeature([{ name: Tv.name, schema: TvSchema }]),
  JwtModule.register({
    secret: 'JWT_SECRET',
    signOptions: { expiresIn: '60m' },
  })],
  controllers: [TvController,ControllerUpdate, ControllerDelete],
  providers: [TvService],
  exports:[TvService, JwtModule]
})
export class TvModule {}
