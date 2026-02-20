import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserDocument } from './users/models/user.schema';
import express from 'express';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user:UserDocument,@Res({passthrough:true}) response:express.Response){
    await this.authService.login(user, response)
    response.send(user)
  }


  @UseGuards(JwtAuthGuard)
  @MessagePattern("authenticate")
  async authenticate(@Payload() data:any){
    return data.user
  }
}
