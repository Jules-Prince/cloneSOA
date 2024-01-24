import {Controller, Get, Post, Query} from '@nestjs/common';
import { RocketService } from '../rocket.service';
import {RocketStatusDto} from "../entities/rocket/dto/rocketStatus.dto";
import {LaunchStatusDto} from "../entities/launcher/dto/launchStatus.dto";
import { Logger, ILogObj } from "tslog";
import { RocketEventsEnum } from "../rocket.events.enum";

@Controller()
export class RocketController {
  private readonly logPrefix = `[Rocket ${RocketService.rocketName}]`;
  private readonly log: Logger<ILogObj> = new Logger();
  constructor(private readonly appService: RocketService) {}

  @Get('launch-request')
  async  getLaunchRequest(@Query('name') name: string = ''): Promise<RocketStatusDto> {
    RocketService.rocketName = name;
    RocketService.logPrefix = `[Rocket ${RocketService.rocketName}] `;

    this.log.info(`${RocketService.logPrefix} Getting the rocket status`);
    this.log.info(`${RocketService.logPrefix} Send the rocket status response`);
    return this.appService.getRocketStatus();
  }

  @Get("launch-order")
  getLaunchOrder(@Query('failure') failure: string = 'false', @Query('auto') auto: string): Promise<LaunchStatusDto> {
    this.log.info(`${RocketService.logPrefix} Receive the launch order`)
    return this.appService.launchRocket(JSON.parse(failure), JSON.parse(auto));
  }

  @Post ("destruct")
  destructRocket(): Promise<String> {
    this.log.info(`${RocketService.logPrefix} Send the destruct order`)
    return this.appService.destructRocket();
  }

  @Get("start-simulator")
  startSimulator() {
    this.appService.startSimulator();
  }

}
