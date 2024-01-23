import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class tblChangePasswordReport {
    @PrimaryGeneratedColumn()
    indexId:number;
    
    @Column()
    userId:number;

    @Column()
    ChangedPasswordDateTime:Date;

    @Column()
    ChangedBy:string;
}
