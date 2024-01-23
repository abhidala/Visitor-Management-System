import { Column } from "typeorm";
import { IsString } from "class-validator";
export class UpdatePasswordDto {
    @IsString()
    password : string;
}