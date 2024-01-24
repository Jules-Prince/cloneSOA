import {ClassSerializerInterceptor, Injectable, UseInterceptors} from '@nestjs/common';
import {WeatherStatusDto} from "./entities/dto/weather-status.dto";
import {Weather} from "./entities/Weather";
import { ILogObj, Logger } from 'tslog';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class AppService {
  private readonly logPrefix = "[Weather]";
  private readonly log: Logger<ILogObj> = new Logger();

  weather: Weather = new Weather();

  getWeatherStatus(): WeatherStatusDto {
    this.log.info(`${this.logPrefix} Getting weather status`);
    this.log.info(`${this.logPrefix} Weather status is: ` + this.weather.getStatus());
    if (this.weather.getStatus() == 'good') return new WeatherStatusDto('go');
    else return new WeatherStatusDto('no-go');
  }
}
