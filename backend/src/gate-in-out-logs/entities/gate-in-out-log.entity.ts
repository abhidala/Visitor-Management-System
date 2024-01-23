import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class tblGateInOutReport {
@PrimaryGeneratedColumn()
   indexId:number;
    
    @Column()
    visitorId:number;

    @Column()
    GateInTime:Date;

    @Column({nullable:true})
    GateOutTime:Date;
    @Column()
    GateGroup:string;
}