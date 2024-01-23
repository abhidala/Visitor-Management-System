import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common';
import { TvvDateService } from './tvv-date.service';
import { TvvDateController } from './tvv-date.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tblVisitorVisitDate } from './entities/tvv-date.entity';
import { tvvDateRepository } from './repo/tvv-date.repository';
import { PassModule } from 'src/pass/pass.module';
import { UserModule } from 'src/user/user.module';
import { GateInOutLogsService } from 'src/gate-in-out-logs/gate-in-out-logs.service';
import { tblGateInOutReport } from 'src/gate-in-out-logs/entities/gate-in-out-log.entity';
import { ModbusService } from 'src/modbus-adam/modbus-adam.service';
@Module({
  imports:[TypeOrmModule.forFeature([tblVisitorVisitDate]),TypeOrmModule.forFeature([tblGateInOutReport]),forwardRef(()=>PassModule),UserModule],
  controllers: [TvvDateController],
  providers: [TvvDateService,tvvDateRepository,GateInOutLogsService,ModbusService],
  
})
export class TvvDateModule {}
