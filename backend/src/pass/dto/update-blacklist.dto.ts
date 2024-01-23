import { PartialType } from '@nestjs/mapped-types';
import { CreatetblVisitorDto } from './create-tblVisitor.dto';
import { Column } from 'typeorm';
import { IsNotEmpty,IsBoolean  } from 'class-validator';

export class UpdateBlacklistDto  {
   @IsBoolean()
   blacklisted:boolean;
}
