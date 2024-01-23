import { Module } from '@nestjs/common';
import { LoginLogsService } from './login-logs.service';
import { LoginLogsController } from './login-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tblLoginReport } from './entities/login-log.entity';
import { LoginReportRepository } from './repo/LoginReportsRepository';

@Module({
  imports:[TypeOrmModule.forFeature([tblLoginReport])],
  controllers: [LoginLogsController],
  providers: [LoginLogsService,LoginReportRepository],
  exports:[LoginLogsModule]
})
export class LoginLogsModule {}
