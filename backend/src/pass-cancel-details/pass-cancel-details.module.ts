import { Module } from '@nestjs/common';
import { PassCancelDetailsService } from './pass-cancel-details.service';
import { PassCancelDetailsController } from './pass-cancel-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassCancelDetail } from './entities/pass-cancel-detail.entity';
import { UserModule } from 'src/user/user.module';
import { CancelPassRepository } from './repo/cancelPass.repository';

@Module({
  imports:[TypeOrmModule.forFeature([PassCancelDetail]),UserModule],
  controllers: [PassCancelDetailsController],
  providers: [PassCancelDetailsService,CancelPassRepository],
})
export class PassCancelDetailsModule {}
