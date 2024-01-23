import { Module } from '@nestjs/common';
import { ChangePasswordLogsService } from './change-password-logs.service';
import { ChangePasswordLogsController } from './change-password-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tblChangePasswordReport } from './entities/change-password-log.entity';
import { ChangePasswordRepository } from './repo/ChangePasswordRepository';

@Module({
  imports:[TypeOrmModule.forFeature([tblChangePasswordReport])],
  controllers: [ChangePasswordLogsController],
  providers: [ChangePasswordLogsService,ChangePasswordRepository],
  exports:[ChangePasswordLogsModule]
})
export class ChangePasswordLogsModule {}