import { Module } from "@nestjs/common";
import { AuthController } from "./auth.cotroller";
import { UserModule } from "../user/user.module";
import { LocalStrategy } from "./strategy/local.strategy";
import { PassportModule } from "@nestjs/passport";
import { UserService } from "../user/user.service";
import {JwtModule} from '@nestjs/jwt';
import { Constants } from "../user/constants/user.constants";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LoginLogsModule } from "src/login-logs/login-logs.module";
import { LoginLogsService } from "src/login-logs/login-logs.service";
import { LoginReportRepository } from "src/login-logs/repo/LoginReportsRepository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { tblLoginReport } from "src/login-logs/entities/login-log.entity";

@Module({
    imports: [
        PassportModule , 
        LoginLogsModule,
        TypeOrmModule.forFeature([tblLoginReport]),
        UserModule,
        JwtModule.registerAsync ({

            imports : [ConfigModule],
            inject : [ConfigService],

            useFactory : ()=>({

                secret :Constants.JWT_KEY ,
            signOptions:{
                expiresIn: '12h',
            }
            })
            
        })

    ],
    controllers: [AuthController],
    providers: [LocalStrategy,JwtStrategy,LoginLogsService]
})
export class AuthModule{}