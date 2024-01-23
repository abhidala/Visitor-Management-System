import { Column } from "typeorm";
import { IsNotEmpty, IsString, IsDate } from 'class-validator';
export class CreateChangePasswordLogDto {
    @IsNotEmpty()
    userId:number;

    @IsDate()
    ChangedPasswordDateTime:Date;

    @IsNotEmpty()
    @IsString()
    ChangedBy:string;
   
}