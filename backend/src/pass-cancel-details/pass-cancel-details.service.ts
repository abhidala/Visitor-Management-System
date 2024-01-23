import { Inject, Injectable } from '@nestjs/common';
import { CreatePassCancelDetailDto } from './dto/create-pass-cancel-detail.dto';
import { UpdatePassCancelDetailDto } from './dto/update-pass-cancel-detail.dto';
import { CancelPassRepository } from './repo/cancelPass.repository';
import { PassCancelDetail } from './entities/pass-cancel-detail.entity';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PassCancelDetailsService {
  constructor(
    @InjectRepository(PassCancelDetail)
    private  cancelPassRepository : CancelPassRepository,
    
    private userService:UserService
    ){}
 async  create(createPassCancelDetailDto: CreatePassCancelDetailDto, userId : number) {
   let CancelPass : PassCancelDetail = new PassCancelDetail();
   CancelPass.PassCancelledAt = new Date().toLocaleDateString();
   CancelPass.user= await this.userService.findById(userId)
  
  return this.cancelPassRepository.save(CancelPass);
  }

  findAll() {
    return `This action returns all passCancelDetails`;
  }

 
}
