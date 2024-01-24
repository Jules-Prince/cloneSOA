/* eslint-disable prettier/prettier */
import {Body, Controller, Get, Post} from '@nestjs/common';
import {TelemetryService} from './telemetry.service';
import { EventStageDto } from './event.stage.dto';
import { ILogObj, Logger } from 'tslog';
import { KafkaService } from './kafka/kafka.service';


@Controller()
export class TelemetryController {
    private readonly log: Logger<ILogObj> = new Logger();
    private readonly logPrefix = "[Telemetry]";
    constructor(private readonly appService: TelemetryService,private readonly kafkaService : KafkaService) {
    }

    @Get("/start")
    startTelemetry(): string {
        return this.appService.startTelemetry();
    }

    @Get("/stop")
    stopTelemetry(): string {
        return this.appService.stopTelemetry();
    }

    @Get("ask-metrics")
    getMetrics(): Promise<void> {
        return this.appService.askRocketIsStatus();
    }

    @Get("start/stage1")
    getStage1Metrics(){
        this.appService.startTelemetryStage1();
    }

    @Get("start/stage2")
    getStage2Metrics(){
        this.appService.startTelemetryStage2();
    }


    @Post("/event/stage")
    async eventStage(@Body() eventStageDto: EventStageDto): Promise<string> {
        this.log.info("Evenement stage  : " + eventStageDto.description);
        await this.kafkaService.emitMessage('launch', 'stageEvent'+eventStageDto.description, JSON.stringify(eventStageDto));
        return `Événement reçu avec succès : ID ${eventStageDto.id}, Description "${eventStageDto.description}", Date ${eventStageDto.date}`;
    }

    @Post("/event/rocket")
    async eventRocket(@Body() eventStageDto: EventStageDto): Promise<string> {
        this.log.info(`${this.logPrefix} Evenement rocket : ` + eventStageDto.description);
        await this.kafkaService.emitMessage('launch', 'rocketEvent '+eventStageDto.description, JSON.stringify(eventStageDto))
        return `Événement reçu avec succès : ID ${eventStageDto.id}, Description "${eventStageDto.description}", Date ${eventStageDto.date}`;
    }

    /*@Get("/detect/anomaly")
    async detectAnomaly(): Promise<string> {
        this.appService.checkAnomaly();
        return "Anomaly detected"
    }*/

}
