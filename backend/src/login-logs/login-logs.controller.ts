import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { LoginLogsService } from './login-logs.service';
import { CreateLoginLogDto } from './dto/create-login-log.dto';
import { UpdateLoginLogDto } from './dto/update-login-log.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import {UseGuards,UsePipes,ValidationPipe} from '@nestjs/common';
@Controller('login-logs')
export class LoginLogsController {
  constructor(private readonly loginLogsService: LoginLogsService) {}

  @Post('/addLogs')
  @UsePipes(new ValidationPipe())
 async logLogin(@Body() loginDto:CreateLoginLogDto){
  await this.loginLogsService.logLogin(loginDto);
  return{message:'login logged successfully'}
 }

  @Get('/findAll')
  @UseGuards( new RoleGuard(["Admin","Compliance_Officer"]))
  findAll() {
    return this.loginLogsService.findAll();
  }

  @Put('/update/:userId')
  @UsePipes(new ValidationPipe())
  async updateLoginReport(
    @Param("userId") userId : number ){
      return this.loginLogsService.updateLoginReport(userId)
    }

  
}
