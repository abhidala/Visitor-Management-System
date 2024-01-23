import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { GateInOutLogsService } from './gate-in-out-logs.service';
import { CreateGateInOutLogDto} from './dto/gate-in-out-log.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import {UseGuards} from '@nestjs/common';
@Controller('gate-in-out-logs')
export class GateInOutLogsController {
  constructor(private readonly gateInOutLogsService: GateInOutLogsService) {}

  @Post('/addLogs')
 async logGateInOut(@Body() gateInOutDto:CreateGateInOutLogDto){
  await this.gateInOutLogsService.logGateInOut(gateInOutDto);
  return{message:'gate in-out logged successfully'}
 }

  @Get('/findAll')
  @UseGuards( new RoleGuard(["Admin","Compliance_Officer"]))
  findAll() {
    return this.gateInOutLogsService.findAll();
  }

  @Put('/update/:visitorId')
  async updateGateInOutReport(
    @Param("visitorId") visitorId : number ){
      return this.gateInOutLogsService.updateGateInOutReport(visitorId)
    }

  
}
