import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoginLogDto } from './dto/create-login-log.dto';
import { UpdateLoginLogDto } from './dto/update-login-log.dto';
import { tblLoginReport } from './entities/login-log.entity';
import { Repository } from 'typeorm';
import { LoginReportRepository } from './repo/LoginReportsRepository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LoginLogsService {
  constructor(
    @InjectRepository(tblLoginReport)
    private loginReportRepository:LoginReportRepository
  ){}
  


 async logLogin (loginDto:CreateLoginLogDto){
  const logEntry = new tblLoginReport();
  logEntry.userId= loginDto.userId;
  logEntry.LogedInDateTime=new Date();
  
await this.loginReportRepository.save(logEntry)
 }

  findAll() {
    return this.loginReportRepository.find({
      order:{
        LogedInDateTime:'DESC',
      }
    });
  }


async updateLoginReport(userId: number): Promise<void> {
  // Find the latest login report for the given user
  const latestLoginReport = await this.loginReportRepository.findOne({
    where: { userId },
    order: { LogedInDateTime: 'DESC' }, // Order by login time in descending order to get the latest entry
  });

  if (!latestLoginReport) {
    throw new NotFoundException(`Login report not found for user with userId ${userId}`);
  }

  // Update the latest login report (e.g., set the logout time)
  latestLoginReport.LogedOutDateTime = new Date(); // Set the logout time to the current time

  // Save the updated login report
  await this.loginReportRepository.save(latestLoginReport);
}
 
}
