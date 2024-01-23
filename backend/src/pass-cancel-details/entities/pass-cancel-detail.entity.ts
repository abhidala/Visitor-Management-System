import { tblUserDetails } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryColumnCannotBeNullableError, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PassCancelDetail {
   
    @PrimaryGeneratedColumn()
    Id:number;
    @Column()
    
    @Column()
    PassCancelledAt:string;

    @ManyToOne(()=>tblUserDetails,(user)=>user.PassCancel)
    user:tblUserDetails;

}
