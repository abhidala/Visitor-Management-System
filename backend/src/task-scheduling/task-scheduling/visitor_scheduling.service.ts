

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PassService } from '../../pass/pass.service';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { table } from 'table';

@Injectable()
export class VisitorSchedulingService {
  private readonly transporter;

  constructor(private readonly passService: PassService) {
    // Created a nodemailer transporter with email service credentials
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'qazifaizan.essi@gmail.com',//yaha yeh change karna 
        pass: 'zyxuasxjtkudjdvn',
      },
    });
  }

  //yha par time rakhna ('0 18 * * *') //yeh wale se 6 baje
  @Cron('0 18 * * *') // Run every day at 6
  async handleCron() {
    // Fetch all users
    const allUsers = await this.passService.getAllUsers();

    // Filter registered visitors based on registration data for everyday..
    const visitorsVisitedToday = this.filterUsers(allUsers.data);

    if(visitorsVisitedToday.length === 0){
        console.log('no visitors registered today');
        return;
    }
    // Save the data to a text file
    const filePath = './registered_visitors.txt';
    
    this.saveDataToFile(filePath, visitorsVisitedToday);
    // Send the text file as an attachment in the email
   this.sendData(filePath);
  }

  private filterUsers(users: any[]): any[] {
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate());

    // Filter users registered today
    return users.filter(user => {
        const registrationTimestamp = user.vCommingDate; 
        const VisitingDate= new Date(registrationTimestamp);
        return VisitingDate >= today && VisitingDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      });
  }

  private saveDataToFile(filePath: string, data: any[]): void {
    //data formatting done here in text file.

      const newDate = new Date().toDateString();

        const headers = ['Id', 'IndexId', 'FirstName', 'LastName',
        'Date of Birth','Vehicle No','Visitor Type','vAddress'];
       //spaces are used for centering the header and footer 
        const companyName='        ESSI,Fax: +91-11-41519898,Email:support@elkostaindia.com, www.elkostaindia.com';
       //yaha jo spaces use ki hain yeh header aur footer ko center karna k liye use thi ,,
        const Heading =`           Government of NCT Delhi - Visitors registered on ${newDate} Report `;
       
        const formattedData = [headers].concat(
            data.map(user => [user.Id, user.indexId, user.vFirstName, user.vLastName ,user.vDateOfBirth,user.vehicleNo,user.visitorType,user.vAddress])
          );
          const formattedTable = table(formattedData);
          

          // Add a custom header above the table
          const tableWithHeader = `${Heading}\n\n${formattedTable}\n${companyName}`;

        //const tableWithHeader = `Elkosta Security Systems India\n\n${formattedTable}`;
     fs.writeFileSync(filePath, tableWithHeader, 'utf-8');
       
  }

  private async sendData(filePath: string): Promise<void> {
    const newDate = new Date().toDateString();
    // Setup email options
    const mailOptions = {
      from: 'qazifaizan.essi@gmail.com',//sender email
      to: 'aijazdar.essi@gmail.com', // reciever email
      subject: 'Registered visitors Report',
      text: 'Please find attached the new registered visitors data for today .',
      attachments: [
        {
          filename: `registered_visitors${newDate}.txt`,
          path: filePath,
        },
      ],
    };

    // Send the email
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(' registered visitors Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
