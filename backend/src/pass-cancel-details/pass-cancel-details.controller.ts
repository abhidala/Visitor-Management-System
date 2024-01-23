import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PassCancelDetailsService } from './pass-cancel-details.service';
import { CreatePassCancelDetailDto } from './dto/create-pass-cancel-detail.dto';
import { UpdatePassCancelDetailDto } from './dto/update-pass-cancel-detail.dto';

@Controller('pass-cancel')
export class PassCancelDetailsController {
  constructor(private readonly passCancelDetailsService: PassCancelDetailsService) {}

  @Post('/createLogs')
  create(@Body() createPassCancelDetailDto: CreatePassCancelDetailDto,@Param('Id') userId:Number) {
    return this.passCancelDetailsService.create(createPassCancelDetailDto,Number(userId));
  }

  @Get()
  findAll() {
    return this.passCancelDetailsService.findAll();
  }

  
}
