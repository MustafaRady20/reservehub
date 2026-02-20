import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async login(user: UserDocument, response: Response) {
    const TokenPayload:TokenPayload ={
      userId:user._id
    }

    const expires = new Date()

    expires.setSeconds(
      expires.getSeconds()+this.configService.get("JWT_EXPIRATION")
    )

    const token = this.jwtService.sign(TokenPayload)
    response.cookie("Authentication",token,{
      httpOnly:true,
      expires
    }) 
  }
}
