import { Column } from "typeorm";
import { IsNotEmpty,IsString,IsNumber,IsBoolean } from "class-validator";
export class CreatetvvDateDto {
    
    @IsNotEmpty()
    @IsString()
    Department:string;

    @IsNotEmpty()
    @IsString()
    AllowedGates:string;
   
    @IsNotEmpty()
    @IsString()
    validFor:string;
    
    @IsString()
    @Column({default:null})
    daysImage:string;
    @IsNotEmpty()
    @IsString()
    AuthobyWhome:string;
     
    @IsNotEmpty()
    @IsString()
    purpose:string;

    // @IsNotEmpty()
    // @Column()
    // noOfItems:string;

    @IsNotEmpty()
    @IsString()
    toMeet:string;

    // @Column({type:'bigint'})
    // Barcode:number;


}
