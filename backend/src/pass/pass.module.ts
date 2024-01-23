import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common';
import { PassService } from './pass.service';
import { PassController } from './pass.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tblVisitor } from './entities/tblVisitor.entity';
import { PassRepository } from './repo/pass.repository';
import { tblVisitorVisitDate } from 'src/tvv-date/entities/tvv-date.entity';
import { tvvDateRepository } from 'src/tvv-date/repo/tvv-date.repository';
import { TvvDateModule } from 'src/tvv-date/tvv-date.module';

@Module({
  imports :[TypeOrmModule.forFeature([tblVisitor]),TypeOrmModule.forFeature([tblVisitorVisitDate]),forwardRef(()=>TvvDateModule)],
  controllers: [PassController],
  providers: [PassService,PassRepository,tvvDateRepository],
  exports:[PassService]
})
export class PassModule {}
