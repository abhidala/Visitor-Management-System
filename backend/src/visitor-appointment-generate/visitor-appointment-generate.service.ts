import { Injectable } from '@nestjs/common';
import { CreateVisitorAppointmentGenerateDto } from './dto/create-visitor-appointment-generate.dto';
import { UpdateVisitorAppointmentGenerateDto } from './dto/update-visitor-appointment-generate.dto';
import { AppointmentRepository } from './repo/appointment.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { tblAppoinTmentGenerate } from './entities/visitor-appointment-generate.entity';
import { Between } from 'typeorm';





@Injectable()
export class VisitorAppointmentGenerateService {
  
  constructor(
    @InjectRepository(tblAppoinTmentGenerate)
    private appointmentRepository : AppointmentRepository){}

    
  create(createVisitorAppointmentGenerateDto: CreateVisitorAppointmentGenerateDto) {
    let appointment : tblAppoinTmentGenerate = new tblAppoinTmentGenerate();
    // appointment.indexNo = createVisitorAppointmentGenerateDto.indexNo;
    // appointment.AppointmentId = createVisitorAppointmentGenerateDto.AppointmentId;
    appointment.fName= createVisitorAppointmentGenerateDto.fName;
    appointment.lName=createVisitorAppointmentGenerateDto.lName;
    appointment.DateOfBirth=createVisitorAppointmentGenerateDto.DateofBirth;
    appointment.vehicleNo=createVisitorAppointmentGenerateDto.vehicleNo;
    appointment.address=createVisitorAppointmentGenerateDto.address;
    appointment.mobileNo=createVisitorAppointmentGenerateDto.mobileNo.toString();
    appointment.AuthorizedBy=createVisitorAppointmentGenerateDto.AuthorizedBy;
    appointment.EmpId=createVisitorAppointmentGenerateDto.EmpId;
   // appointment.generateAppointmentTime = createVisitorAppointmentGenerateDto.generateAppointmentTime;
    return this.appointmentRepository.save(appointment);
  }

  
  async findAll(): Promise<tblAppoinTmentGenerate[]> {
    const visitors = await this.appointmentRepository.find();
    visitors.sort((a, b) => new Date(b.generateAppointmentTime).getTime() - new Date(a.generateAppointmentTime).getTime());
    return visitors;
  }
 
}
