import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { Response } from 'express';


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


  @Post('menu')
  getMenu() {
    return this.authService.getMenu();
  }

  


}
