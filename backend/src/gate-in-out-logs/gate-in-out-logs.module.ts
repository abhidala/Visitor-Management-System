import { Module } from '@nestjs/common';
import { GateInOutLogsService } from './gate-in-out-logs.service';
import { GateInOutLogsController } from './gate-in-out-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tblGateInOutReport } from './entities/gate-in-out-log.entity';
import { GateInOutRepository } from './repo/GateInOutRepository';

@Module({
  imports:[TypeOrmModule.forFeature([tblGateInOutReport])],
  controllers: [GateInOutLogsController],
  providers: [GateInOutLogsService,GateInOutRepository],
  exports:[GateInOutLogsModule]
})
export class GateInOutLogsModule {}