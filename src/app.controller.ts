import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';
import { StatusResponse } from './app.status-response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status')
  @MessagePattern('authorization.status')
  getServiceStatus(): StatusResponse {
    return this.appService.getStatus();
  }
}
