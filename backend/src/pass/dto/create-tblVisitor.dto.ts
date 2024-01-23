import { IsNotEmpty,IsString,IsNumber,IsBoolean } from "class-validator";
import { Column } from "typeorm";
export class CreatetblVisitorDto {
    
    @IsString()
    vFirstName: string;

    @IsString()
    vLastName :string ;

    @IsString()
    vDateOfBirth:string;

    @IsString()
    vehicleNo:string;

    @IsString()
    vAddress: string;
    
    @IsNumber()
    vMobileNo: number;
    
    @IsString()
    visitorType: string ;
    @IsBoolean()
    @Column({default:false})
    blacklisted:boolean;
    @IsString()
    vPhoto:string;
   @IsNotEmpty()
    @IsString()
    vSignature:string;
}
