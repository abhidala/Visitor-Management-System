import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class tblGateCluster {
@PrimaryGeneratedColumn()
   indexId:number;
    
    @Column()
    GateGroup:string;

    @Column()
    AdamIp:string;

    @Column()
    SystemIp:string;
    
}