import { Controller, Get,Req,UploadedFiles,NotFoundException, Post, Body, Patch, Param, Delete,UseInterceptors, Put, InternalServerErrorException } from '@nestjs/common';
import { PassService } from './pass.service';
import { tblVisitor } from './entities/tblVisitor.entity';
import { UpdatePassDto } from './dto/update-pass.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import {UseGuards,UsePipes} from '@nestjs/common';
import { UpdateBlacklistDto } from './dto/update-blacklist.dto';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
@Controller('pass')
export class PassController {
  constructor(private readonly passService: PassService) {}

  @Post('/addUser')

  @UseGuards( new RoleGuard(["Admin","Receptionist"]))
  @UsePipes(new ValidationPipe())
  async createVisitor(@Body() requestData: any): Promise<string> {
    const result = await this.passService.create(requestData);
    return 'user added successfully'
  }

 
  @Get('/findAllvisitors/:page/:pageSize')
  @UseGuards( new RoleGuard(["Admin","Compliance_Officer","Receptionist"])) // Define your GET endpoint path
  async getUsers(@Param('page') page: number = 1, @Param('pageSize') pageSize: number = 10): Promise<{ data: tblVisitor[]; total: number }> {
    return this.passService.getAllUsers(page, pageSize);
  } 

  @Get('/findAllvisitorsByDate/:page/:pageSize/:startDate/:endDate')
  @UseGuards( new RoleGuard(["Admin","Compliance_Officer","Receptionist"])) // Define your GET endpoint path
  async getUsersByDate(@Param('page') page: number = 1, @Param('pageSize') pageSize: number = 10,@Param('startDate') startDate:Date,@Param('endDate') endDate:Date): Promise<{ data: tblVisitor[]; total: number }> {
    return this.passService.getAllUsersByDate(page, pageSize,startDate,endDate);
  } 
  @Get('findUserSearch/:query/:page/:pageSize')
  @UseGuards( new RoleGuard(["Admin","Compliance_Officer","Receptionist"]))
  async searchUser(@Param('query') query,@Param('page') page: number = 1, @Param('pageSize') pageSize: number = 10){
    return this.passService.searchUser(query,page,pageSize);
  }
//get a visitor by Id
@Get('/findUser/:Id')
@UseGuards( new RoleGuard(["Admin","Receptionist"]))
async findUserById(@Param('Id') Id: number) {
  const user = await this.passService.findById(Id);
  return user;
 
}
@Patch('/updateBlacklist/:visitorId')
@UseGuards(new RoleGuard(["Admin"]))
@UsePipes(new ValidationPipe())
updateBlacklist(@Param('visitorId') visitorId:number){
    return this.passService.updateBlacklist(visitorId);
}
//update visitor details 
@Put('editVisitor/:Id')
@UsePipes(new ValidationPipe())
@UseGuards( new RoleGuard(["Admin","Receptionist"]))
async updateUserById(
  @Param('Id') Id: number,
  @Body() updatePassDto: UpdatePassDto,
): Promise<void> {
  try {
    await this.passService.updateUserById(Id, updatePassDto);
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw new NotFoundException(error.message);
    } else {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}

}
