import { Controller,UseInterceptors,UploadedFiles, Get,NotFoundException, Post, Body, Patch,Req, Param, Delete, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { tblUserDetails } from './entities/user.entity';
import { RoleGuard } from 'src/auth/guard/role.guard';
import {UseGuards,UsePipes} from '@nestjs/common';
import { DuplicateKeyExceptionFilter } from './exceptions/duplicate-key.exception';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';

import * as fs from 'fs';
import { AuthGuard } from '@nestjs/passport';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  

  @Post('/addUser')
  @UseGuards( new RoleGuard(["Admin"]))
  @UsePipes(new ValidationPipe())
  @UseFilters(new DuplicateKeyExceptionFilter())
  async create (@Body() requestData:any):Promise<string>{
    const result = await this.userService.create(requestData);
    console.log("Result",result);
    return 'user added sucessfully'
  }
  
@Get('/findAllUsers')
@UseGuards( new RoleGuard(["Admin"]))
async findAll(@Req() req: Request) {
  const users = await this.userService.findAll();
  users.sort((a,b)=>b.userId-a.userId);
    

  return users;
}
//user by id

@Get('/findUser/:userId')
@UseGuards( new RoleGuard(["Admin"]))
async findUserById(@Param('userId') userId: number) {
  const user = await this.userService.findById(userId);
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // const baseUrl = 'http://localhost:3000'; // Your frontend base URL
  const palmImage = user.palmImage ? `${user.palmImage.replace('./uploads/', '/')}` : '';
  const photoImage = user.photoImage ? `${user.photoImage.replace('./uploads/', '/')}` : '';

  const userWithImages = {
    ...user,
    palmImage,
    photoImage,
  };

  return userWithImages;
}





 //! Admin role 
  @Delete('/:userId')
  @UseGuards( new RoleGuard(["Admin"]))
  // @UseGuards(new RoleGuard('Admin'))
  remove(@Param('userId') userId: number, @Req() req) {
    return this.userService.remove(+userId);
  }

  @Get(':userName')
  @UseGuards( new RoleGuard(["Admin"]))
  async findOne(@Param("userName") userName : string):Promise<tblUserDetails>{
    return this.userService.findOneByUsername(userName);
  }
  @Patch('/update/:userId/:userType')
  @UseGuards( new RoleGuard(["Admin","Receptionist","Compliance_Officer","Guard"]))
  @UsePipes(new ValidationPipe())
  update(@Param('userId' ) userId:number, @Param('userType') userType: string,@Body() updatePasswordDto : UpdatePasswordDto){
    return this.userService.updatePassword(userId,userType,updatePasswordDto.password)
  }
 
}
