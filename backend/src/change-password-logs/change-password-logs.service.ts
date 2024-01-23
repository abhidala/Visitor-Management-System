import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChangePasswordLogDto } from './dto/create-change-password-log.dto';
//import { UpdateLoginLogDto } from './dto/update-login-log.dto';
import { tblChangePasswordReport } from './entities/change-password-log.entity';
import { Repository } from 'typeorm';
import { ChangePasswordRepository } from './repo/ChangePasswordRepository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChangePasswordLogsService {
  constructor(
    @InjectRepository(tblChangePasswordReport)
    private changePasswordRepository:ChangePasswordRepository
  ){}
  


 async logChangePassword (changePasswordDto:CreateChangePasswordLogDto){
  const logEntry = new tblChangePasswordReport();
  logEntry.userId= changePasswordDto.userId;
  logEntry.ChangedPasswordDateTime=new Date();
  logEntry.ChangedBy = changePasswordDto.ChangedBy;
  
await this.changePasswordRepository.save(logEntry)
 }

  findAll() {
    return this.changePasswordRepository.find({
      order:{
        ChangedPasswordDateTime:'DESC',
      }
    });
  }
}


