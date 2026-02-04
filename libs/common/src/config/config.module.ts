import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule as NestCongfigModule} from '@nestjs/config';
import Joi from 'joi'
@Module({   
     imports:[NestCongfigModule.forRoot({
        validationSchema:Joi.object({
            DATABASE_HOST:Joi.string().required()
        })
     })],
     providers:[ConfigService],
     exports:[ConfigService]
})
export class ConfigModule {}
