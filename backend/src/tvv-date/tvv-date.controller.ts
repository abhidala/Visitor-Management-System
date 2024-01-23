import { Controller, Get, Post,Req, Body, Patch, Param,UsePipes, Delete, UseGuards } from '@nestjs/common';
import { TvvDateService } from './tvv-date.service';
import { CreatetvvDateDto } from './dto/create-tvv-date.dto';
import { UpdatePassCancelDetailDto } from 'src/pass-cancel-details/dto/update-pass-cancel-detail.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { UseFilters } from '@nestjs/common';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { HttpExceptionFilter } from 'src/exceptions/http-exception.filter';
@Controller('visits')
export class TvvDateController {
  constructor(private readonly tvvDateService: TvvDateService) {}

  @Post(':Id')
  @UsePipes(new ValidationPipe())
  create(@Body() createTvvDateDto:CreatetvvDateDto, @Param('Id') visitorId:number) {
    return this.tvvDateService.create(createTvvDateDto,Number(visitorId));
  }
  @Get('findDaysImage/:indexId')
  findImageByIndexId(@Param('indexId') indexId:number){
 return this.tvvDateService.findImageByIndexId(indexId);
  }
  @Get('findAllVisits')
  @UseGuards(new RoleGuard(["Admin","Compliance_Officer"]))
  findAll() {
    return this.tvvDateService.findAll();
  }
  
  @Get('/oneVisit/:indexId')
  findVisitByIndexId(@Param('indexId') indexId: number) {
    return this.tvvDateService.findVisitByIndexId(indexId);
  }
//Find visit by barcode

@Get('/barcodeNo/:barcode')
// @UseGuards(new RoleGuard(["Admin","Guard"]))
//@UseFilters(new HttpExceptionFilter())
findByBarcode(@Param('barcode') barcode:string){
  return this.tvvDateService.findByBarcodeNo(barcode)
}
  



  //find all visits by Id
  @Get('findAllvisits/:visitorId')
  findAllVisits(@Param('visitorId') visitorId:Number){
    return this.tvvDateService.findAllVisits(Number(visitorId));
  }

  @Get('visiting-info/:pageNumber/:pageSize')
  @UseGuards(new RoleGuard(["Admin","Compliance_Officer","Receptionist","Guard"]))
async getAllVisitingInfo(@Param('pageNumber') pageNumber:number,@Param('pageSize') pageSize:number) {
  const visitingInfoRecords = await this.tvvDateService.getAllVisitingInfo(pageNumber,pageSize);
  return visitingInfoRecords;
}
@Get('visiting-info-byDate/:pageNumber/:pageSize/:startDate/:endDate')
@UseGuards(new RoleGuard(["Admin","Compliance_Officer","Receptionist","Guard"]))
async getAllVisitingInfoByDate(@Param('pageNumber') pageNumber:number,@Param('pageSize') pageSize:number,@Param('startDate') startDate,@Param('endDate') endDate) {
  const visitingInfoRecords = await this.tvvDateService.getAllVisitingInfoByDate(pageNumber,pageSize,startDate,endDate);
  return visitingInfoRecords;
}

@Patch('/:indexId/:UserId')
@UsePipes(new ValidationPipe())
update(@Param('indexId') indexId: number, @Param('UserId') UserId: number) {
 return this.tvvDateService.update(indexId, UserId);
}
 }
