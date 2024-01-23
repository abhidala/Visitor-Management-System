import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitorAppointmentGenerateDto } from './create-visitor-appointment-generate.dto';

export class UpdateVisitorAppointmentGenerateDto extends PartialType(CreateVisitorAppointmentGenerateDto) {}
