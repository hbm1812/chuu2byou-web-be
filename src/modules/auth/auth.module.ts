import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../users/schemas/users.schemas';


@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '60m' },
    })],
    controllers: [AuthController],
    providers: [AuthService],
    exports:[AuthService, JwtModule]
  })
  export class AuthModule {}