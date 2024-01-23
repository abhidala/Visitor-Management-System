import { PartialType } from '@nestjs/mapped-types';
import { CreatetvvDateDto } from './create-tvv-date.dto';
import { Column } from 'typeorm';
import { IsBoolean,IsString } from 'class-validator';
export class UpdateTvvDateDto extends PartialType(CreatetvvDateDto) {

    @IsBoolean()
    Access:boolean;

    // @Column()
    // PassCancelledBy:number;

    @IsString()
    PassCancelledAt:string;
}
