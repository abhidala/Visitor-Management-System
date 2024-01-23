import { Column } from "typeorm";

export class CreateGateInOutLogDto {
    @Column()
    visitorId:number;
    @Column()
    GateGroup:string;

    @Column()
    GateInTime:Date;
    
    @Column()
    GateOutTime:Date;
    
   
}