import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/lift-off")
  getGoLiftOff(): Object {
    return this.appService.getGoLiftOff();
  }
}