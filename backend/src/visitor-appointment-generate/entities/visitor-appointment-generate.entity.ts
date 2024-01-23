import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Entity()
export class tblAppoinTmentGenerate {
  @Column({ unique: true, type: 'bigint'})
  indexNo: number;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true, type: 'bigint' })
  AppointmentId: number;

  @Column({ nullable: true })
  @IsNotEmpty()
  fName: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  lName: string;

  @Column({ nullable: true, default: 'NA' })
  @IsNotEmpty()
  DateOfBirth: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  vehicleNo: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  address: string;

  @Column({ nullable: true})
  @IsNotEmpty()
  mobileNo: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  AuthorizedBy: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  EmpId: string;

  @CreateDateColumn({ nullable: true })
  generateAppointmentTime: Date;
  constructor() {
    this.generateAppointmentTime = new Date();
  }

  @BeforeInsert()
  generateIndexNo() {
    this.indexNo = Math.floor(Math.random() * 1000);
  }

  @BeforeInsert()
  generateAppoitmentID() {
    this.AppointmentId = Math.floor(Math.random() * 10000);
  }

  get formattedGenerateAppointmentTime(): string {
    if (this.generateAppointmentTime) {
      // Convert the date to IST format
      return this.generateAppointmentTime.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata', // IST Time Zone
        dateStyle: 'short',
        timeStyle: 'short',
      });
    }
  }
}
