import {Body, Controller, Get, Post} from '@nestjs/common';
import { AppService } from './app.service';
import {StageDto} from "./dto/stage.dto";
import {StageStatusDto} from "./dto/stageStatus.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("stage1/start")
  start1Metrics(@Body() stageDto:StageDto): Promise<string> {
    //this.appService.startEvent();
    return this.appService.start1Metrics(stageDto);
  }

  @Post("stage2/start")
  start2Metrics(@Body() stageDto:StageDto): Promise<string> {
    //this.appService.startEvent();
    return this.appService.start2Metrics(stageDto);
  }

  @Get("/stage1/metrics")
  getMetrics1():Promise<StageStatusDto>{
    return this.appService.getMetrics(1);
  }

  @Get("/stage2/metrics")
  getMetrics2():Promise<StageStatusDto>{
    return this.appService.getMetrics(2);
  }
}