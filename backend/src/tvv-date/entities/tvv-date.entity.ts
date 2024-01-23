import { IsNotEmpty } from 'class-validator';
import { tblVisitor } from 'src/pass/entities/tblVisitor.entity';
import { tblUserDetails } from 'src/user/entities/user.entity';
import {Column, Entity, BeforeInsert,PrimaryGeneratedColumn,Generated, ManyToOne, PrimaryColumn} from 'typeorm'
@Entity()
export class tblVisitorVisitDate {
    @Generated()
    @Column({type:'bigint'})
    indexId:number;

    @Column({default:'0',type:'bigint'})
    PassNumber:Number;

     @IsNotEmpty()
    @PrimaryColumn()
    Barcode:string;
    
    @IsNotEmpty()
    @Column({ nullable:true,default: () => 'CURRENT_TIMESTAMP' })
    vDate: Date;

    @IsNotEmpty()
    @Column({nullable:true})
    toMeet:string;

    @IsNotEmpty()
    @Column({nullable:true})
    Department: string ;
    
    @IsNotEmpty()
    @Column({nullable:true,default:'not available'})
    noOfItems: string;

    
    @Column({nullable:true})
    AllowedGates: string;
   
    
    @Column({nullable:true})
    ValidFor: string;
    
    @IsNotEmpty()
    @Column({nullable:true})
    AuthobyWhome: string;

    @IsNotEmpty()
    @Column({nullable:true})
    purpose:string;

    @Column({default:true})
    Access:Boolean;
    @Column({default:null})
    daysImage:string;
    @Column({default:'not cancelled'})
    PasscancelledAt:string;
    
    // @Column({default:'0000'})
    // PassCancelledBy:number

    @Column({nullable:true})
    vistorId:number;
    @BeforeInsert()
    updateDates() {
      this.vDate = new Date(); // Set the current date and time before inserting
    }

    @ManyToOne(()=>tblVisitor,(visitor)=> {return visitor.visitorDates})
    visitor:tblVisitor;
    @ManyToOne (()=>tblUserDetails,(PassCancelledBy)=>PassCancelledBy.visitDate)
    PassCancelledBy:tblUserDetails;

    @BeforeInsert()
    generatePassNo(){
      this.PassNumber = Math.floor(100000000 + Math.random()*900000000);
    }

    

    @BeforeInsert()
    generateBarcode() {
      // Generate an 18-digit barcode
      this.Barcode = Math.floor(100000000000000000 + Math.random() * 900000000000000000).toString();
    }
}
