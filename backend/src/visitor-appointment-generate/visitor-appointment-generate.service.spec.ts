import { Test } from '@nestjs/testing';
import { VisitorAppointmentGenerateService } from './visitor-appointment-generate.service';
import { AppointmentRepository } from './repo/appointment.repository';



const mockTasksRepository =()=>({

})

const mockAppointment = {

}
describe('VisitorAppointmentGenerateService' , ()=>{
    let appointmentService :VisitorAppointmentGenerateService;
    let appointmentRepository;

    beforeEach(async ()=>{
        const module = await Test.createTestingModule({
            providers:[
                VisitorAppointmentGenerateService,{
                    provide : AppointmentRepository , useFactory : mockTasksRepository},

            ],
        }).compile();
        appointmentService = module.get(VisitorAppointmentGenerateService);
        appointmentRepository= module.get(AppointmentRepository);
    });
})

















































//   describe('findAll', () => {
//     it('should return an array of appointments', async () => {
//       const expectedResult: tblAppoinTmentGenerate[] = []; // Use the actual type here
      
//       jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

//       const result = await controller.findAll();
//       expect(result).toBe(expectedResult);
//     });
//   });

