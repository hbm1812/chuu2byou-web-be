import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Works, WorksSchema } from './schemas/works.schema';
import { WorksController } from './works.controller';
import { WorksService } from './works.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Works.name, schema: WorksSchema }]),
  JwtModule.register({
    secret: 'JWT_SECRET',
    signOptions: { expiresIn: '60m' },
  })],
  controllers: [WorksController],
  providers: [WorksService],
  exports:[WorksService, JwtModule]
})
export class WorksModule {}
