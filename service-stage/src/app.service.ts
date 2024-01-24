import { Injectable } from '@nestjs/common';
import * as process from 'process';
import { ILogObj, Logger } from 'tslog';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { StageDto } from './dto/stage.dto';
import { StageStatusDto } from './dto/stageStatus.dto';
import { StageEventsService } from './stage.events.service';

@Injectable()
export class AppService {
  private heightForParachute: number = 800;
  private fallSpeed: number = 80;
  private fallSpeedWParachute: number = 40;
  private height: number = 0;
  private name: string = 'stage1';
  private parachute: boolean = false;
  private state: string = 'Falling';
  private stageEventsService: StageEventsService = new StageEventsService(
    this.http,
  );

  private readonly logPrefix = '[Stage]';
  private readonly log: Logger<ILogObj> = new Logger();
  constructor(private http: HttpService) {}

  async getMetrics(stageNmber: number): Promise<StageStatusDto> {
    if (this.height < this.heightForParachute) this.parachute = true;

    if (this.parachute) this.height = this.height - this.fallSpeedWParachute;
    else this.height = this.height - this.fallSpeed;

    if (this.height < 0) {
      this.height = 0;
      this.state = 'ToEarth';
    }

    await this.stageEventsService.isEventSendIt(this.height);

    if (stageNmber == 1) {
      this.name = 'stage1';
    } else if (stageNmber == 2) {
      this.name = 'stage2';
    }

    return new StageStatusDto(
      this.name,
      this.height,
      this.parachute,
      this.state,
    );
  }

  async start1Metrics(stageDto: StageDto): Promise<string> {
    this.height = stageDto.height;
    this.stageEventsService.heightMax = this.height;
    this.log.info(` ${this.logPrefix} hauteur du stage 1 : ` + this.height);

    this.log.info(`${this.logPrefix} requests telemetry to start`);
    const url = process.env.TELEMETRY_URL + '/start/stage1';
    const request = this.http.get(url).pipe(map((res) => res.data?.status));
    await lastValueFrom(request);

    return 'ok';
  }

  async start2Metrics(stageDto: StageDto): Promise<string> {
    this.height = stageDto.height;
    this.stageEventsService.heightMax = this.height;
    this.log.info(` ${this.logPrefix} hauteur du stage 2 : ` + this.height);
    this.log.info(`${this.logPrefix} requests telemetry to start`);
    const url = process.env.TELEMETRY_URL + '/start/stage2';
    const request = this.http.get(url).pipe(map((res) => res.data?.status));
    await lastValueFrom(request);

    return 'ok';
  }
}
