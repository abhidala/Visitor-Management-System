import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGateInOutLogDto } from './dto/gate-in-out-log.dto';
//import { UpdateLoginLogDto } from './dto/update-login-log.dto';
import { tblGateInOutReport } from './entities/gate-in-out-log.entity';
import { Repository } from 'typeorm';
import { GateInOutRepository } from './repo/GateInOutRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull } from 'typeorm';

@Injectable()
export class GateInOutLogsService {
  constructor(
    @InjectRepository(tblGateInOutReport)
    private gateInOutRepository:GateInOutRepository
  ){}
  


 async logGateInOut(gateInOutDto:CreateGateInOutLogDto){
  const logEntry = new tblGateInOutReport();
  logEntry.visitorId= gateInOutDto.visitorId;
  logEntry.GateInTime=new Date();
  logEntry.GateOutTime=null;
  logEntry.GateGroup = gateInOutDto.GateGroup;
  
await this.gateInOutRepository.save(logEntry)
 }

  findAll() {
    return this.gateInOutRepository.find({
      order:{
        GateOutTime:'DESC',
      }
    });
  }
  async updateGateInOutReport(visitorId: number): Promise<void> {
    
    const latestGateInOutReport = await this.gateInOutRepository.findOne({
      where: { visitorId,GateOutTime: IsNull()  },
      order: { GateInTime: 'DESC' }, 
    });
  
    if (!latestGateInOutReport) {
      throw new NotFoundException(`Gate In report not found for user with userId ${visitorId}`);
    }
  
   // latestGateInOutReport.forEach(element => {element.GateOutTime=new Date();})
      
   // });
    latestGateInOutReport.GateOutTime = new Date(); 
  
    
    await this.gateInOutRepository.save(latestGateInOutReport);
  }
   
}


