import { Module } from '@nestjs/common';
import { PassModule } from './pass/pass.module';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TvvDateModule } from './tvv-date/tvv-date.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { VisitorAppointmentGenerateModule } from './visitor-appointment-generate/visitor-appointment-generate.module';
import { LoginLogsModule } from './login-logs/login-logs.module';
import { ChangePasswordLogsModule } from './change-password-logs/change-password-logs.module';
import { PassCancelDetailsModule } from './pass-cancel-details/pass-cancel-details.module';
import { MonitoringService } from './monitoring/monitoring.service';
import { MonitoringController } from './monitoring/monitoring.controller';
import { TaskSchedulingModule } from './task-scheduling/task-scheduling/task-scheduling.module';
import { GateInOutLogsModule } from './gate-in-out-logs/gate-in-out-logs.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true, envFilePath: ['.local.env'] }),
    ServeStaticModule.forRoot({
      rootPath:join(__dirname,'..','uploads')
    }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject: [ConfigService],
     useFactory:(configService:ConfigService)=>({
      type:'postgres',
      host: configService.get('DATABASE_HOST'),
      port: configService.get('DATABASE_PORT') , 
      username: configService.get('DATABASE_USERNAME') ,
      password:  configService.get('DATABASE_PASSWORD'),
      synchronize: configService.get('DATABASE_SYNC') ,
      database:  configService.get('DATABASE_NAME'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      logging: false,
     })
    }),
    PassModule,
    TvvDateModule,UserModule,TaskSchedulingModule,AuthModule,VisitorAppointmentGenerateModule, LoginLogsModule, PassCancelDetailsModule,ChangePasswordLogsModule,GateInOutLogsModule
      ,HealthCheckModule
  ],
  providers: [MonitoringService
    // provide: APP_FILTER,
    // useClass: HttpExceptionFilter,
  ],
  controllers: [MonitoringController],
 
})
export class AppModule {}
