import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class tblLoginReport {
    @PrimaryGeneratedColumn({type:'bigint'})
    indexId:number;
    
    @Column({nullable:true,type:'bigint'})
    userId:number;

    @Column({nullable:true})
    LogedInDateTime:Date;

    @Column({nullable:true,default:()=>'CURRENT_TIMESTAMP'})
    LogedOutDateTime:Date;
}

