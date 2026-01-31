import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../config';
import { ConfigService } from '@nestjs/config';

@Module({
    imports:[
        MongooseModule.forRootAsync({
        imports:[ConfigModule],
        useFactory:(configService:ConfigService)=>({
            uri:configService.get("DATABASE_HOST")
        }),
        inject:[ConfigService]
    })]
})
export class DatabaseModule {}
