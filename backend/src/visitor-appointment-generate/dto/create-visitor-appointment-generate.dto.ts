import { IsNotEmpty ,IsNumber  } from "class-validator";
import { Column } from "typeorm";


export class CreateVisitorAppointmentGenerateDto {

    // @Column()
    // indexNo : number ;

    // @Column()
    // AppointmentId : number;

    @Column()
    @IsNotEmpty()
    fName : string ;

    @Column()
    @IsNotEmpty()
    lName : string ;

    @Column()
    @IsNotEmpty()
    DateofBirth : string ;

    @Column()
    @IsNotEmpty()
    vehicleNo : string ;

    @Column()
    @IsNotEmpty()
    address : string;

    @Column()
    @IsNotEmpty()
    mobileNo : Number ;

    @Column()
    @IsNotEmpty()
    AuthorizedBy : string ;

    @Column()
    @IsNotEmpty()
    EmpId : string ; 

    // @Column()
    // generateAppointmentTime : string ;
    
}
