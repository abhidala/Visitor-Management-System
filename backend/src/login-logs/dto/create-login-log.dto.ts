// import { Column } from "typeorm";
import { IsNotEmpty,IsString,IsNumber,IsDate } from "class-validator";
export class CreateLoginLogDto {
    @IsNotEmpty()
    @IsNumber()
    userId:number;

    @IsDate()
    LogedInDateTime:Date;
    
    @IsDate()
    LogedOutDateTime:Date;
   
}
