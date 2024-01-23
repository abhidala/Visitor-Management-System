import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { tblVisitorVisitDate } from 'src/tvv-date/entities/tvv-date.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class tblVisitor {

  @Column({ unique: true,type:'bigint'})
  indexId: number;

  @PrimaryGeneratedColumn({type:'bigint'})
  vistorId: number;

  @Column({nullable:true})
  vFirstName: string;

  @Column({nullable:true})
  vLastName: string;

  @Column({nullable:true})
  vDateOfBirth: string;

  @Column({nullable:true,default:'NA'})
  vehicalNo: string;

  @Column({nullable:true})
  vAddress: string;

  @Column({nullable:true })
  vMobileNo: string;

  @Column({nullable:true})
  visitorType: string;

  @IsNotEmpty()
  @Column({nullable:true})
  vPhoto: string;
  @IsNotEmpty()
  @Column({ default: false })
  blacklisted: boolean;
  @IsNotEmpty()
  @Column({nullable:true})
  vSignature: string;

  @Column({ nullable:true,default: () => 'CURRENT_TIMESTAMP' })
  vCommingDate: Date;
  @Column({nullable:true,type:'bytea'})
  vTemplate:Buffer;
  @Column({nullable:true})
  vSuspicious:boolean;
  @Column({nullable:true})
  Reason:string;
  @BeforeInsert()
  generateIndexId() {
    this.indexId = Math.floor(Math.random() * 1000);
  }
  @BeforeInsert()
  updateDates() {
    this.vCommingDate = new Date();
  }

  @OneToMany(() => tblVisitorVisitDate, (visitorDate) => visitorDate.visitor)
  visitorDates: tblVisitorVisitDate[];
}
