import { Controller, Get, Post, Body, Patch, Param, Delete, Put,UsePipes } from '@nestjs/common';
import { ChangePasswordLogsService } from './change-password-logs.service';
import { CreateChangePasswordLogDto } from './dto/create-change-password-log.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import {UseGuards} from '@nestjs/common';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
@Controller('change-password-logs')
export class ChangePasswordLogsController {
  constructor(private readonly changePasswordLogsService: ChangePasswordLogsService) {}

  @Post('/addLogs')
  @UsePipes(new ValidationPipe())
 async logChangePassword(@Body() changePasswordDto:CreateChangePasswordLogDto){
  await this.changePasswordLogsService.logChangePassword(changePasswordDto);
  return{message:'change Password logged successfully'}
 }

  @Get('/findAll')
  @UseGuards( new RoleGuard(["Admin","Compliance_Officer"]))
  findAll() {
    return this.changePasswordLogsService.findAll();
  }

//   @Put('/update/:userId')
//   async updateLoginReport(
//     @Param("userId") userId : number ){
//       return this.loginLogsService.updateLoginReport(userId)
//     }

  
}
