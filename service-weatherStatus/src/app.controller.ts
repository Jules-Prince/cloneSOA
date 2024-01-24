import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {WeatherStatusDto} from "./entities/dto/weather-status.dto";
import { ILogObj, Logger } from 'tslog';


@Controller('weather-status')
export class AppController {
  private readonly log: Logger<ILogObj> = new Logger();
  private readonly logPrefix = "[Weather]";
  constructor(private readonly appService: AppService) {}

  @Get('')
  getWeatherStatus(): WeatherStatusDto {
    return this.appService.getWeatherStatus();
  }
}
