import { PrimaryGeneratedColumn,Column } from "typeorm";
import { IsString,IsNumber } from "class-validator";
export class CreateUserDto {

    @IsString()
    userName : string ;

    @IsString()
    password  : string;

    @IsString()
    shiftTime: string;

    @IsString()
    designation : string;

    @IsNumber()
    contactNumberL : number;

    @IsString()
    contactNumberM : number;

    @IsString()
    address : string ;

    @IsString()
    userType : string ;


    @Column({nullable:true})
    photoImage : string;
    
}
