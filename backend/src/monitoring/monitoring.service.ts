import { Injectable } from '@nestjs/common';
import * as os from 'os-utils';
const oss = require('os');
@Injectable()
export class MonitoringService {constructor() {
    
    const interval = 1000; 
    setInterval(() => {
      os.cpuUsage((cpuUsage) => {
       // console.log(`CPU Usage: ${cpuUsage}%`);
      });

      //console.log(`Free Memory: ${os.freememPercentage()}`);
     // console.log(`Total Memory:${oss.totalmem()}`);
     // console.log(`Free Memory:${oss.freemem()}`);
     // console.log(Math.round((oss.freemem() * 100) / oss.totalmem()) + '%')
    }, interval);
  }}
