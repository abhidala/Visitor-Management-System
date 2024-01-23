import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repo/user.repository';
import { DuplicateKeyExceptionFilter } from './exceptions/duplicate-key.exception';
import {  tblUserDetails } from './entities/user.entity';
import { tblChangePasswordReport } from 'src/change-password-logs/entities/change-password-log.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ChangePasswordLogsService} from '../change-password-logs/change-password-logs.service';

@Module({
  imports : [TypeOrmModule.forFeature([tblUserDetails]),TypeOrmModule.forFeature([tblChangePasswordReport]),
],
  controllers: [UserController],
  providers: [UserService,UserRepository,DuplicateKeyExceptionFilter,ChangePasswordLogsService],
  exports : [UserService]
})
export class UserModule {}
