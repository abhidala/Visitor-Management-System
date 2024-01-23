import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatetblVisitorDto } from './dto/create-tblVisitor.dto';
import { UpdatePassDto } from './dto/update-pass.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TvvDateService } from 'src/tvv-date/tvv-date.service';
import { tblVisitor } from './entities/tblVisitor.entity';
import { Repository } from 'typeorm';
import { Between ,ILike} from 'typeorm';
import { tblVisitorVisitDate } from 'src/tvv-date/entities/tvv-date.entity';
import { tvvDateRepository } from 'src/tvv-date/repo/tvv-date.repository';
@Injectable()
export class PassService {
  constructor(
    // private visitDateRepository:Repository<tblVisitorVisitDate>,
    // private tvvDateService:TvvDateService,
    @InjectRepository(tblVisitor)
    private passRepository:Repository<tblVisitor>,
    @InjectRepository(tblVisitorVisitDate)
    private visitDateRepository:Repository<tblVisitorVisitDate>,
     ){}
    

    async create(requestData: any): Promise<string> {
      const user = new tblVisitor();
      user.vFirstName = requestData.vFirstName;
      user.vLastName = requestData.vLastName;
      user.vDateOfBirth = requestData.vDateOfBirth;
      user.vMobileNo = requestData.vMobileNo;
      user.vehicalNo = requestData.vehicleNo;
      user.visitorType = requestData.visitorType;
      user.vAddress = requestData.vAddress;
      user.vPhoto = requestData.vPhoto; // Assuming vPhoto is already a base64 string
      user.vSignature = requestData.vSignature; // Assuming vSignature is already a base64 string
  
      await this.passRepository.save(user);
  
      return 'User added successfully';
    }
async searchUser(query,page,pageSize){
  const skip= (page-1)*pageSize;
  const [data, total] = await this.passRepository.findAndCount({
    
    where:[{vMobileNo: ILike(`%${query}%`)},],
    order: {
      vCommingDate: 'DESC',
    },
    skip,
        take: pageSize,
  })
  return { data, total };
}
    
    //findall visitors service 
    async getAllUsers(page: number = 1, pageSize: number = 10): Promise<{ data: tblVisitor[]; total: number }> {
      const skip = (page - 1) * pageSize;
  
      const [data, total] = await this.passRepository.findAndCount({
        order: {
          vCommingDate: 'DESC',
        },
        skip,
        take: pageSize,
      });
  
      return { data, total };
    }
    async getAllUsersByDate(page: number = 1, pageSize: number = 10, startDate?: Date, endDate?: Date ): Promise<{ data: tblVisitor[]; total: number }> {
      const skip = (page - 1) * pageSize;
    
      let whereCondition = {};
    
      // If startDate and endDate are provided, add a condition for the date range
      if (startDate && endDate ) {
        whereCondition = {
          vCommingDate: Between(startDate, endDate),
        };
      }
    
      const [data, total] = await this.passRepository.findAndCount({
        where: whereCondition,
        order: {
          vCommingDate: 'DESC',
        },
        skip,
        take: pageSize,
      });
    
      return { data, total };
    }
    //find visitor by id 

    findUserById(Id:number){
      return this.passRepository.findOneOrFail({where:{vistorId:Id}})
    }

    async findById(Id: number): Promise<tblVisitor> {
      return this.passRepository.findOne({where:{vistorId:Id}});
    }
  //update user by id 
  async updateBlacklist(visitorId: number):Promise<{success:boolean,data?:string,error?:string}> {
    try {
      const visitor = await this.passRepository.findOne({ where: { vistorId: visitorId } });
      const visitorVisitDates = await this.visitDateRepository.find({ where: { vistorId: visitorId } });
     console.log(typeof(visitor));
      if (visitor===null) {
        
        throw new NotFoundException('Visitor Not found');
      } else {
        if (visitor.blacklisted === false) {
          visitor.blacklisted = true;
          visitorVisitDates.forEach(function (val, index) {
            val.PasscancelledAt = new Date().toLocaleString();
          });
        } else {
          visitor.blacklisted = false;
  
          visitorVisitDates.forEach(function (val, index) {
            val.PasscancelledAt = 'not cancelled';
          });
        }
       
        await this.visitDateRepository.save(visitorVisitDates);
        await this.passRepository.save(visitor);
        //console.log(visitorVisitDates);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message || 'An error occurred' };
    }
  }
  
  async updateUserById(Id: number, updatePassDto: UpdatePassDto): Promise<void> {
    const user = await this.passRepository.findOne({where:{vistorId:Id}});

    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log(user,"Old");
    // Update user properties using the DTO
    Object.assign(user, updatePassDto);
   console.log(user,"userNew");
    await this.passRepository.save(user);
  }
  
}
