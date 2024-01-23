import { PartialType } from '@nestjs/mapped-types';
import { CreatePassCancelDetailDto } from './create-pass-cancel-detail.dto';

export class UpdatePassCancelDetailDto extends PartialType(CreatePassCancelDetailDto) {}
