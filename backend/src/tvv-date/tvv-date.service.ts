import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { CreatetvvDateDto } from './dto/create-tvv-date.dto';
import { UpdateTvvDateDto } from './dto/update-tvv-date.dto';
import { InjectRepository} from '@nestjs/typeorm';
import { Between } from 'typeorm';
import { tblVisitorVisitDate } from './entities/tvv-date.entity';
import { tvvDateRepository } from './repo/tvv-date.repository';
import { PassService } from 'src/pass/pass.service';
import { PassRepository } from '../pass/repo/pass.repository';
import { tblVisitor } from '../pass/entities/tblVisitor.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guards';
import { UserService } from 'src/user/user.service';
import { CreateGateInOutLogDto } from 'src/gate-in-out-logs/dto/gate-in-out-log.dto';
import { GateInOutLogsService } from 'src/gate-in-out-logs/gate-in-out-logs.service';
// import { ModbusService } from 'src/modbus-adam/modbus-adam.service';
const Modbus = require('modbus-serial');
@Injectable()
export class TvvDateService {
  private client:any
  constructor(
    private gateInOutLogsService:GateInOutLogsService,
    @InjectRepository(tblVisitorVisitDate)
    private TvvDateRepository:tvvDateRepository,
    private passService:PassService,
    private  userService:UserService,
  //  private modbusService:ModbusService
    ){}

  async create(createTvvDateDto: CreatetvvDateDto, visitorId:number) {
    let visitingInfo = new tblVisitorVisitDate();
    //visitingInfo.Barcode=createTvvDateDto.Barcode;
    visitingInfo.Department=createTvvDateDto.Department;
    visitingInfo.AllowedGates=createTvvDateDto.AllowedGates;
    visitingInfo.ValidFor=createTvvDateDto.validFor;
    visitingInfo.toMeet=createTvvDateDto.toMeet;
    visitingInfo.purpose=createTvvDateDto.purpose;
    // visitingInfo.noOfItems=createTvvDateDto.noOfItems;
    visitingInfo.daysImage=createTvvDateDto.daysImage;
    visitingInfo.AuthobyWhome=createTvvDateDto.AuthobyWhome;
    visitingInfo.visitor=await this.passService.findUserById(visitorId);
  return this.TvvDateRepository.save(visitingInfo);

  }

  findAll() {
    return this.TvvDateRepository.find(
      {
        order:{
          vDate:'DESC'
        }
      }
    );
  }

  findAllVisits(visitorId:number){
    return this.TvvDateRepository.find({
      relations:['visitor'],
      where:{visitor:{vistorId:visitorId}}
    })

  }
  async connectModbusServer(serverIP: string, serverPort: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = new Modbus();
      this.client.connectTCP(serverIP, { port: serverPort }, (err) => {
        if (err) {
          console.error('Error connecting to Modbus TCP server:', err);
          reject(err);
        } else {
          console.log(`Connected to Modbus TCP server ${serverPort}`);
          resolve();
        }
      });
    });
  }

  async toggleCoil(
    serverIP: string,
    serverPort: number,
    discreteInputAddress: number,
    coilAddress: number,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.connectModbusServer(serverIP, serverPort);

      const isDiscreteInputFalse = await this.client.readDiscreteInputs(discreteInputAddress, 1);
     
      
      if (isDiscreteInputFalse.data[0] === true) {
        const currentCoilValue = await this.client.readCoils(coilAddress, 1);
         
         
        if (currentCoilValue.data[0] === true) {
          await this.client.writeCoil(coilAddress, false);
        } else {
          await this.client.writeCoil(coilAddress, true);
        }

        return { success: true, message: 'Coil toggled successfully' };
      } else {
        return { success: false, message: 'Discrete input is not false, cannot toggle the coil' };
      }
    } catch (err) {
      return { success: false, message: `Error: ${err.message}` };
    } finally {
      //  this.client.writeCoil(coilAddress, false);

      this.client.close(() => {
        
        console.log('Modbus connection closed.');
      });
    }
  }

async findImageByIndexId(indexId:number){
try{
const visits =await this.TvvDateRepository.find({
  where:{indexId:indexId}
});
if (!visits || visits.length === 0) {
  throw new Error(`No visit found for indexId: ${indexId}`);
}
return {image:visits[0].daysImage};
}catch(error){
  console.error('Error fetching the image for given indexId:',error);
}
}

async findVisitByIndexId(indexId: number) {
  try {
    const visits = await this.TvvDateRepository.find({
      relations: ['visitor'],
      where:{indexId:indexId}
    });

    if (!visits || visits.length === 0) {
      throw new NotFoundException(`No visit found for indexId: ${indexId}`);
    }

    return visits;
  } catch (error) {
    console.error('Error fetching visit by indexId:', error);
    
  }
}

async findByBarcodeNo (barcode:string){
  function isWithinOneMonth(startDate, endDate) {
   
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
  
    
    const monthDiff = (endDateObj.getFullYear() - startDateObj.getFullYear()) * 12 +
      (endDateObj.getMonth() - startDateObj.getMonth());
  
    
    if( Math.abs(monthDiff) <= 1){
      return true;
    }
    else {
      return false;
    }
  }
  function isWithinthreeMonth(startDate, endDate) {
    
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
  
    
    const monthDiff = (endDateObj.getFullYear() - startDateObj.getFullYear()) * 12 +
      (endDateObj.getMonth() - startDateObj.getMonth());
  
    
    return Math.abs(monthDiff) <= 3;
  }
  function isWithinOneWeek(startDate, endDate) {
    
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
  
    
    const timeDifference = Math.abs(endDateObj.getTime() - startDateObj.getTime());

  
  const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;

  
  return timeDifference <= oneWeekInMilliseconds;
  }
  function isWithinOneDay(givenDateTime, targetDateTime) {
    
    const givenDate = new Date(givenDateTime);
    givenDate.setHours(0, 0, 0, 0);
  
    const targetDate = new Date(targetDateTime);
    targetDate.setHours(0, 0, 0, 0);
  
    
    const differenceInMilliseconds = Math.abs(givenDate.getTime() - targetDate.getTime());
  
    
    const millisecondsInOneDay = 24 * 60 * 60 * 1000;
  
    
    if (differenceInMilliseconds <= millisecondsInOneDay) {
      
      const givenTime = givenDateTime.getTime() % millisecondsInOneDay;
      const targetTime = targetDateTime.getTime() % millisecondsInOneDay;
  
      return Math.abs(givenTime - targetTime) <= millisecondsInOneDay;
    }
  
    return false;
  }
  try {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
  
    
    const startTime = 19; 
    const endTime = 10;
    const visits = await this.TvvDateRepository.find({
      relations: ['visitor'],
      where:{Barcode:barcode}
    });

    if (!visits || visits.length === 0) {
      return ({message:`No pass found for barcode: ${barcode}`});
    } 
    // else if((currentHour > startTime || (currentHour === startTime && currentMinute >= 0)) ||
    // (currentHour < endTime || (currentHour === endTime && currentMinute <= 0))){
    //   return ("No entry in these hours");
    // }
    else if(visits[0]?.PasscancelledAt ==="not cancelled" && visits[0]?.ValidFor==="one day" && isWithinOneDay(visits[0]?.vDate,new Date())){
      
      const logs = await this.gateInOutLogsService.findAll();
    // if(logs.some(data=>data.visitorId===visits[0].visitor.Id && data.GateOutTime===null)){
    //   // await this.gateInOutLogsService.updateGateInOutReport(visits[0].visitor.Id)
    // }
    // else {

const gateInOutDto:CreateGateInOutLogDto={
  visitorId:visits[0].visitor.vistorId,
  GateInTime:new Date(),
  GateOutTime:null,
  GateGroup:"A"
}

await this.gateInOutLogsService.logGateInOut(gateInOutDto); 
    //}
 return visits;
    }
    else if(visits[0]?.PasscancelledAt ==="not cancelled" && visits[0]?.ValidFor==="one week" && isWithinOneWeek(visits[0]?.vDate,new Date())){
      
      const logs = await this.gateInOutLogsService.findAll();
    // if(logs.some(data=>data.visitorId===visits[0].visitor.Id && data.GateOutTime===null)){
    //   // await this.gateInOutLogsService.updateGateInOutReport(visits[0].visitor.Id)
    // }
    // else {

const gateInOutDto:CreateGateInOutLogDto={
  visitorId:visits[0].visitor.vistorId,
  GateInTime:new Date(),
  GateOutTime:null,
  GateGroup:"A"
}

await this.gateInOutLogsService.logGateInOut(gateInOutDto); 
    //}
 return visits;
    }
    else if(visits[0]?.PasscancelledAt ==="not cancelled" && visits[0]?.ValidFor==="one month" && isWithinOneMonth(visits[0]?.vDate,new Date())){
      
      const logs = await this.gateInOutLogsService.findAll();
    // if(logs.some(data=>data.visitorId===visits[0].visitor.Id && data.GateOutTime===null)){
    //   // await this.gateInOutLogsService.updateGateInOutReport(visits[0].visitor.Id)
    // }
    // else {

const gateInOutDto:CreateGateInOutLogDto={
  visitorId:visits[0].visitor.vistorId,
  GateInTime:new Date(),
  GateOutTime:null,
  GateGroup:"A"
}

await this.gateInOutLogsService.logGateInOut(gateInOutDto); 
    //}
 return visits;
    }
    else if(visits[0]?.PasscancelledAt ==="not cancelled" && visits[0]?.ValidFor==="three months" && isWithinthreeMonth(visits[0]?.vDate,new Date())){
      
      const logs = await this.gateInOutLogsService.findAll();
    // if(logs.some(data=>data.visitorId===visits[0].visitor.Id && data.GateOutTime===null)){
    //   // await this.gateInOutLogsService.updateGateInOutReport(visits[0].visitor.Id)
    // }
    // else {

const gateInOutDto:CreateGateInOutLogDto={
  visitorId:visits[0].visitor.vistorId,
  GateInTime:new Date(),
  GateOutTime:null,
  GateGroup:"A"
}

await this.gateInOutLogsService.logGateInOut(gateInOutDto); 
    //}
 return visits;
    }
//  await this.connectModbusServer("192.168.0.220",502);
//  await this.toggleCoil("192.168.0.220",502,0,65)
else{
   return ({message:`Pass has been cancelled or expired`})} ;
  } catch (error) {
    console.error('Error fetching visit by indexId:', error);
    
  }
}






async getAllVisitingInfo(pageNumber,pageSize) {
 const skip = (pageNumber - 1) * pageSize;
 
  const [data,total] = await this.TvvDateRepository.findAndCount({
    relations: ['visitor'],
    order: {
      vDate: 'DESC',
    },
    skip,
  take: pageSize,
  });
  return { data, total };
}
async getAllVisitingInfoByDate(pageNumber,pageSize,startDate,endDate){
  const skip = (pageNumber - 1) * pageSize;
    
      let whereCondition = {};
    
    
      if (startDate && endDate ) {
      const sd = new Date(startDate);
      const ed = new Date(endDate);
      console.log(sd,ed);
        whereCondition = {
          vDate: Between((sd), (new Date(ed.getTime()+86400000))),
        };
      }
    
      const [data, total] = await this.TvvDateRepository.findAndCount({
        where: whereCondition,
        relations:['visitor'],
        order: {
          vDate: 'DESC',
        },
        skip,
        take: pageSize,
      });
    
      return { data, total };
}
async update(indexId: number, UserId: number): Promise<tblVisitorVisitDate> {
  const tvvupdate = await this.TvvDateRepository.findOne({ where: { indexId: indexId } });
  if (!tvvupdate) { throw new NotFoundException("Not Found") }
 
  tvvupdate.Access = false;
  tvvupdate.PasscancelledAt = new Date().toLocaleString();
  tvvupdate.PassCancelledBy = await this.userService.findById(UserId);
 
  return this.TvvDateRepository.save(tvvupdate);
 }
 
}

