// src/monitoring/monitoring.controller.ts
import { Controller, Get } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import * as os from 'os-utils'; // Import the os-utils library

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get()
  async getStatus() {
    const cpuUsage = await new Promise((resolve) => {
      os.cpuUsage((usage) => {
        resolve(usage);
      });
    });

    const freeMemory = os.freememPercentage();

    return {
      cpuUsage,
      freeMemory,
    };
  }
}
