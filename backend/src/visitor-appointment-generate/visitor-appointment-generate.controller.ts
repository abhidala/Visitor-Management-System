import { Controller,ValidationPipe, Get,Query, Post, Body, Req,Patch, Param, Delete } from '@nestjs/common';
import { VisitorAppointmentGenerateService } from './visitor-appointment-generate.service';
import { CreateVisitorAppointmentGenerateDto } from './dto/create-visitor-appointment-generate.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import {UseGuards} from '@nestjs/common';

@Controller('vag')
export class VisitorAppointmentGenerateController {
  constructor(private readonly visitorAppointmentGenerateService: VisitorAppointmentGenerateService) {}

  @Post('/createAppointment')
  @UseGuards(new RoleGuard(["Admin","Receptionist"]))
  create(@Body(ValidationPipe) createVisitorAppointmentGenerateDto: CreateVisitorAppointmentGenerateDto) {
    return this.visitorAppointmentGenerateService.create(createVisitorAppointmentGenerateDto);
  }

  @Get('/findAll')
  @UseGuards( new RoleGuard(["Admin","Compliance_Officer","Receptionist"]))
  findAll() {
    return this.visitorAppointmentGenerateService.findAll();
  }
}

