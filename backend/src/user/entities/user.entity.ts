import { IsNotEmpty } from 'class-validator';
import { PassCancelDetail } from 'src/pass-cancel-details/entities/pass-cancel-detail.entity';
import { tblVisitorVisitDate } from 'src/tvv-date/entities/tvv-date.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BeforeInsert } from 'typeorm';

@Entity()
@Unique(['userName'])
export class tblUserDetails {
  @Column({ unique: true, type: 'bigint' })
  indexId: number;
  @PrimaryGeneratedColumn({type: 'bigint'})
  userId: number;

  @Column({ nullable: true })
  userName: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  shiftTime: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ nullable: true })
  contactNumberL: string;

  @Column({ nullable: true })
  contactNumberM: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  userType: string;

  @Column({ nullable: true, default: 'nothing' })
  palmImage: string;

  @IsNotEmpty()
  @Column({ default: false })
  deleted: boolean;
  @Column({ default: false })
  resetAdmin: boolean;

  @Column({ nullable: true })
  Pending: boolean;
  @IsNotEmpty()
  @Column({ nullable: true })
  photoImage: string;

  @BeforeInsert()
  generateIndexId() {
    this.indexId = Math.floor(Math.random() * 1000);
  }

  @OneToMany(() => PassCancelDetail, (PassCancel) => PassCancel.user)
  PassCancel: PassCancelDetail[];

  @OneToMany(
    () => tblVisitorVisitDate,
    (visitDate) => visitDate.PassCancelledBy,
  )
  visitDate: tblVisitorVisitDate[];
}
