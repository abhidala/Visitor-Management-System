import { Column } from "typeorm";
import { CreateUserDto } from "./create-user.dto";

import { IsString } from "class-validator";

export class UpdateUserDto extends CreateUserDto {
    @IsString()
    password: string;
}
