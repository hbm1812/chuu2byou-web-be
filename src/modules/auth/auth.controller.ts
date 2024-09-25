import { Body, Controller, Get, Post,Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';


@Controller('security')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('authenticate')
    async login(@Body() auth: { username: string; password: string; }) {
        return this.authService.login(auth.username, auth.password)
    }

   
    @UseGuards(JwtAuthGuard)
    @Post('profile')
    async getProfile(@Request() req) {
      return this.authService.profile(req.user.userId);
    }
    
  
}
