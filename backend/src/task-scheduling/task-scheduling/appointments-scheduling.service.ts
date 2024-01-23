import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { table } from 'table';
import { VisitorAppointmentGenerateService } from 'src/visitor-appointment-generate/visitor-appointment-generate.service';

@Injectable()
export class AppointmentsSchedulingService {
  private readonly transporter;

  constructor(private readonly appointmentService: VisitorAppointmentGenerateService) {
    // Created a nodemailer transporter with  email service credentials
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'qazifaizan.essi@gmail.com',
        pass: 'zyxuasxjtkudjdvn',
      },
    });
  }

  @Cron('0 18 * * *') // Runs at every day at 6 pm
  async handleCron() {
    console.log('cron job started')
    // Fetch all appointments
    const allAppointments = await this.appointmentService.findAll();
  
  
    // Filter appointments for today.
   
    const appointmentsToday = this.filterUsers(allAppointments);

    if(appointmentsToday.length===0){
 
        console.log('No Appointments for today')
        return;
    }
    // Save the data to a text file
    const filePath = './Appointments.txt';
   
    this.saveDataToFile(filePath, appointmentsToday);
    // Send the text file as an attachment in the email
   this.sendData(filePath);
  }

  private filterUsers(users: any[]): any[] {
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate());
    

    // Filter appointments for today.
    return users.filter(user => {
      const registrationTimestamp = user.generateAppointmentTime; 
      const appointmentDate= new Date(registrationTimestamp);
      return appointmentDate >= today && appointmentDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    });
  }

  private saveDataToFile(filePath: string, data: any[]): void {
   
        const headers = [ 'Id', 'IndexID', 'AppointmentId','FirstName',
        'LastName','Date of Birth','Vehicle No','Address','Authorized By','EmpId','Mobile No'];
       
        const newDate= new Date().toDateString();
        const companyName ='                                  ESSI,Fax: +91-11-41519898,Email:support@elkostaindia.com, www.elkostaindia.com';
       
        const Heading =`                                     Government of NCT Delhi - Visitors registered on ${newDate} Report `;
      
    
        const formattedData = [headers].concat(
            data.map(user => [user.id,user.indexId,user.AppointmentId,user.fName,user.lName,user.DateofBirth,user.vehicleNo,user.address,
                user.AuthorizedBy,user.EmpId, user.mobileNo])
          );
          const formattedTable = table(formattedData);
          const tableWithHeader=`${Heading}\n\n${formattedTable}\n${companyName}`
       fs.writeFileSync(filePath, tableWithHeader, 'utf-8');
    

    
  }

  private async sendData(filePath: string): Promise<void> {
    // Setup email options

    const newDate=new Date().toDateString();
    const mailOptions = {
      from: 'qazifaizan.essi@gmail.com',
      to: 'aijazdar.essi@gmail.com',
      subject: 'Appointment  Report',
      text: 'Please find Appointments data for today in the attached file.',
      attachments: [
        {
          filename:` Appointments-${newDate}.txt`,
          path: filePath,
        },
      ],
    };

    // Send the email
    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Appointments report Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}