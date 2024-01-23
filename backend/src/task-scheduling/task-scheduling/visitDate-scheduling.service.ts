import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { table } from 'table';
import { TvvDateService } from 'src/tvv-date/tvv-date.service';
import * as Table from 'cli-table3';
@Injectable()
export class VisitDateSchedulingService {
  private readonly transporter;

  constructor(private readonly tvvDateService: TvvDateService) {
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
    // Fetch all visitors visited
    // const allUsers = await this.tvvDateService.getAllVisitingInfo();
  

    // Filter visitors who have visited today.
   
    // const visitorsVisitedToday = this.filterUsers(allUsers);

    // if(visitorsVisitedToday.length===0){
 
    //     console.log('No registered visitors today')
    //     return;
    // }
    // Save the data to a text file
    const filePath = './Visitors_Visited.txt';
   
   // this.saveDataToFile(filePath, visitorsVisitedToday);
    // Send the text file as an attachment in the email
   this.sendData(filePath);
  }

  private filterUsers(users: any[]): any[] {
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate());
    

    // Filter users based on visiting date who visited today.
    return users.filter(user => {
      const registrationTimestamp = user.vDate; 
      const VisitingDate= new Date(registrationTimestamp);
      return VisitingDate >= today && VisitingDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    });
  }

  private saveDataToFile(filePath: string, data: any[]): void {
    

    const newDate = new Date().toDateString();
        const headers = [ 'IndexId', 'To Meet', 'Department','AuthbyWhome',
        'Purpose','Barcode' , 'Visitor Id' ,'Access','Pass Cancelled At' ,
        'Allowed Gates' , 'Valid For','Pass Number'];

      const companyName='Elkosta Security Systems India,Fax: +91-11-41519898,Email:support@elkostaindia.com, www.elkostaindia.com, 101- Mercantile House, K.G Marg, New Delhi-110001, Ph: +91-11-41519899';
      const Heading =`Government of NCT Delhi - Visitors registered on ${newDate} Report `;
        const formattedData = [headers].concat(
            data.map(user => [user.indexId, user.toMeet, user.Department,user.AuthbyWhome,user.purpose,
                user.Barcode,user.visitorId,user.Access,user.PasscancelledAt,user.AllowedGates,
                user.validFor,user.PassNumber])
          );
          const formattedTable = table(formattedData);
          //aise bhi hoskta tha yeh par woh files mai error dikha raha tha , woh table chote thai

            // Calculate the number of spaces needed to center the header
            const tableWidth = formattedTable.split('\n')[0].length; // Get the width of the first row
            const headerSpaces = Math.floor((tableWidth - Heading.length) / 2);
            const footerSpaces= Math.floor((tableWidth - companyName.length) / 2);
            // Center the header above the table
            const centeredHeader = ' '.repeat(headerSpaces) + Heading;
            const centeredFooter = ' '.repeat(footerSpaces) +companyName;

            // Add a custom header above the table
            const tableWithHeader = `${centeredHeader}\n${formattedTable}\n${centeredFooter}`;

          //const tableWithHeader = `Elkosta Security Systems India\n\n${formattedTable}`;
       fs.writeFileSync(filePath, tableWithHeader, 'utf-8');
    }   
 



  private async sendData(filePath: string): Promise<void> {
    // Setup email options
    const newDate = new Date().toDateString();
    const mailOptions = {
      from: 'qazifaizan.essi@gmail.com',
      to: 'aijazdar.essi@gmail.com',
      subject: 'Visitors visited  Report',
      text: 'Please find visitors visited data for today in the attached file.',
      attachments: [
        {
          filename: `Visitors_Visited${newDate}.txt`,
          path: filePath,
        },
      ],
    };

    // Send the email
    try {
      await this.transporter.sendMail(mailOptions);
      console.log('visit date report Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}