import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthCheckController {
  @Get()
  checkHealth(): { status: string } {
    return { status: 'Server is up and running' };
  }
}
