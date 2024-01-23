import { PartialType } from '@nestjs/mapped-types';
import { CreatetblVisitorDto } from './create-tblVisitor.dto';
import { Column } from 'typeorm';
import { IsNotEmpty, IsString, IsBoolean, IsNumber, IsOptional, IsDate } from 'class-validator';
export class UpdatePassDto {
    @IsNotEmpty()
    @IsString()
    vFirstName: string;
    @IsNotEmpty()
    @IsString()
    vLastName: string;
    @IsNotEmpty()
    @IsString()
    vDateOfBirth: string;
    @IsNotEmpty()
    @IsString()
    vehicleNo: string;
    @IsNotEmpty()
    @IsString()
    vAddress: string;
    @IsNotEmpty()
    @IsString()
    vMobileNo: string;
    @IsNotEmpty()
    @IsOptional()
    @IsBoolean()
    @Column({ default: false })
    blacklisted: boolean;
    @IsNotEmpty()
    @IsString()
    visitorType: string;
    @IsOptional()
    @IsString()
    vPhoto: string;
    @IsOptional()
    @IsString()
    vSignature: string;
}