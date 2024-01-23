import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { table } from 'table';
import { LoginLogsService } from 'src/login-logs/login-logs.service';

@Injectable()
export class LoginLogsSchedulingService {
  private readonly transporter;

  constructor(private readonly loginService: LoginLogsService) {
    // Created a nodemailer transporter with email service credentials
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'qazifaizan.essi@gmail.com',
        pass: 'zyxuasxjtkudjdvn',
      },
    });
  }

  @Cron('0 18 * * *')// Runs every day at 6
  async handleCron() {
    
    // Fetch all LoginLogs
    const allLogs = await this.loginService.findAll();

    // Filter Loginlogs data for today..
    const LoginLogsToday = this.filterUsers(allLogs);

    if(LoginLogsToday.length === 0){
        console.log('no employee loged in today ');
        return;
    }
    // Save the data to a text file
    const filePath = './Logedin-LogedOut_reports.txt';
    
    this.saveDataToFile(filePath, LoginLogsToday);
    // Send the text file as an attachment in the email
   this.sendData(filePath);
  }

  private filterUsers(users: any[]): any[] {
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate());

    // Filter Login  Logs of users for today
    return users.filter(user => {
        const registrationTimestamp = user.LogedInDateTime; 
        const LoginDate= new Date(registrationTimestamp);
        return LoginDate >= today && LoginDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      });
  }

  private saveDataToFile(filePath: string, data: any[]): void {
   

    const newDate = new Date().toDateString();
    //spaces are used for centering the text.
    const companyName='                               ESSI,Fax: +91-11-41519898,Email:support@elkostaindia.com, www.elkostaindia.com';
       
     const Heading =`                                 Government of NCT Delhi - Visitors registered on ${newDate} Report `;
   
     //data formatting done here in text file.
        const headers = ['indexId', 'userId', 'Logged In Date/Time', 'Logged Out Date/Time',];
       
    
        const formattedData = [headers].concat(
            data.map(user => [user.indexId,user.userId,user.LogedInDateTime,user.LogedOutDateTime])
          );

          const formattedTable = table(formattedData);

          const tableWithHeader =`${Heading}\n\n${formattedTable}\n${companyName}`
       fs.writeFileSync(filePath, tableWithHeader, 'utf-8');
       
  }

  private async sendData(filePath: string): Promise<void> {
    // Setup email options
    const newDate=new Date().toDateString();
    const mailOptions = {
      from: 'qazifaizan.essi@gmail.com',//sender email
      to: 'aijazdar.essi@gmail.com', // reciever email
      subject: 'Login Logout Reports of Employees',
      text: 'Please find attached the new login logs data of employees  for today .',
      attachments: [
        {
          filename:`Logedin-LogedOut_reports-${newDate}.txt`,
          path: filePath,
        },
      ],
    };

    // Send the email
    try {
      await this.transporter.sendMail(mailOptions);
      console.log(' Login/Logout Logs Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
