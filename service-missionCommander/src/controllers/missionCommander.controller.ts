
import {Body, Controller, Get, OnModuleInit, Post} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { MissionService } from '../services/mission.service';
import { MissionDto } from '../dto/mission.dto';
import { ILogObj, Logger } from 'tslog';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import {EventStageDto} from "../dto/event.stage.dto";
import {CassandraService} from "../services/logs.service";
import {types} from "cassandra-driver";
import Row = types.Row;
import { KafkaService } from 'src/kafka/kafka.service';
import { Logs } from 'src/logs.model';
import { LogsDTO } from 'src/dto/logs.dto';


@Controller()
@ApiTags('Mission')
export class MissionCommanderController implements OnModuleInit {
    private readonly log: Logger<ILogObj> = new Logger();
    private readonly logPrefix = "[Mission status]";

  constructor(private readonly missionService: MissionService, private logsService : CassandraService,
    private readonly kafkaService : KafkaService) {}

  onModuleInit() {
    this.kafkaService.subscribeToTopics(["monitoring","launch"], async (topic, message) => {
        switch (topic) {
            case "monitoring": {
                const resetColor = '\x1b[0m';
                const brownColor = '\x1b[38;5;173m';

                switch (message.key?.toString()) {   
                    case "rocket-metrics":
                        //this.log.info(`${this.logPrefix}========================ROCKET_METRIC========================`);
                        const response = JSON.parse(message.value.toString() ?? '{}');
                        const rocketname = response.rocketname;
                        const log  = new LogsDTO("rocket-metrics", message.value.toString(),rocketname);
                        this.logsService.pushLog(log);
                        //console.log( "metrics received : " + response);
                        //this.log.info(`${this.logPrefix} Receive rocket metrics` + message.value.toString());
                    break;

                    case "stage1-metrics":
                        //this.log.info(`${this.logPrefix}========================STAGE1_METRIC========================`);
                        const stage_metrics = JSON.parse(message.value.toString() ?? '{}');
                        const stagename = stage_metrics.name;
                        const log_stage  = new LogsDTO("stage1-metrics", stage_metrics.value,stagename);
                        this.logsService.pushLog(log_stage);
                        //console.log( "metrics of stage  " + stagename + " received : " + stage_metrics);
                        //this.log.info(`${this.logPrefix} Receive stage1 metrics` + message.value.toString());
                        //console.log("metrics of stage 1 received : " + message.value);
                    break;

                    case "stage2-metrics":
                        //this.log.info(`${this.logPrefix}========================STAGE2_METRIC========================`);
                        const stage2_metrics = JSON.parse(message.value.toString() ?? '{}');
                        const stagename2 = stage2_metrics.name;
                        const log_stage2  = new LogsDTO("stage2-metrics", stage2_metrics.value,stagename2);
                        this.logsService.pushLog(log_stage2);
                        //console.log( "metrics of stage  " + stagename + " received : " + stage_metrics);
                        //this.log.info(`${this.logPrefix} Receive stage2 metrics` + message.value.toString());
                    break;
                    
                    case "anomaly":
                        const greenColor = '\x1b[32m';
                        await this.missionService.sendOrderOfDestruction();
                        this.log.info(`${greenColor}${this.logPrefix}===============ANOMALY===============${resetColor}`);
                        //const anomaly = JSON.parse(message.value);
                        const anomalyLog = new LogsDTO("anomaly", message.value.toString(),"rocket");
                        this.logsService.pushLog(anomalyLog);
                        this.log.info(`${greenColor}${this.logPrefix} Receive ${message.value.toString()}${resetColor}`);
                        this.log.info(`${greenColor}${this.logPrefix} WE SEND THE ORDER OF DESTRUCTION TO THE ROCKET${resetColor}`);
                    break;
                    case "payload-telemetry-started":
                        this.log.info(`${brownColor}${this.logPrefix} RECEIVED THE CONFIRMATION OF PAYLOAD DEPLOYMENT AND START OF OBSERVATION${resetColor}`);
                    break;

                    case "payload-telemetry-data":
                        this.log.info(`${brownColor}${this.logPrefix} Réception de données de position du payload${resetColor}`);
                        this.log.info(`${brownColor}${this.logPrefix} La position actuelle du payload est ${message.value.toString()}${resetColor}`);
                        // stock telemetry data in cassandra
                        break;
                }
                break;
            }
            case "launch": {
                const resetColor = '\x1b[0m';
                const isRocketEvent =  message.key.toString().startsWith("rocketEvent")
                const isStageEvent =  message.key.toString().startsWith("stageEvent")
                if(isRocketEvent){
                    const yellowColor = '\x1b[33m';
                    this.log.info(`${yellowColor}${this.logPrefix}===============<ROCKET_EVENT>===============${resetColor}`);
                    this.log.info(`${yellowColor}${this.logPrefix}   EVENT :  ${message.key.toString()}${resetColor}`);
                    const rocketEventLog = new LogsDTO("rocketEvent", message.value.toString(),"rocket");
                    this.logsService.pushLog(rocketEventLog);
                }
                else if(isStageEvent){
                    const redColor = '\x1b[31m';
                    this.log.info(`${redColor}${this.logPrefix}===============<STAGE_EVENT>===============${resetColor}`);
                    this.log.info(`${redColor}${this.logPrefix}  EVENT : ${message.key.toString()}${resetColor}`);
                    const stageEventLog = new LogsDTO("stageEvent", message.value.toString(),"rocket");
                    this.logsService.pushLog(stageEventLog);
                }
                else{
                    break;
                }
            }
        }
    });
  }

    @Post("/anomaly")
    @ApiResponse({
        status: 200,
        description: 'receive if there is an anomaly',
        type: String
    })
    async getAnomaly(): Promise<string> {
        this.log.info(`${this.logPrefix} we receive an anomaly from telemetry`);
        await this.missionService.sendOrderOfDestruction();
        return "Order of destruction sent to the rocket";
    }

    @Get("/missionLogs")
    async getMissionLogs() {
        try {
            const missionLogs = await this.logsService.seeMissionLogs();
            const rocketEvents = missionLogs.rocketEvents;
            const stageEvents = missionLogs.stageEvents;

            const allLogs = {
                rocketEvents: [],
                stageEvents: []
            };

            for (const log of rocketEvents) {
                const { id, ...logWithoutId } = log;
                allLogs.rocketEvents.push(logWithoutId);
            }

            for (const log of stageEvents) {
                const { id, ...logWithoutId } = log;
                allLogs.stageEvents.push(logWithoutId);
            }

            await this.logsService.deleteAll();

            // Return logs as a JSON string
            return JSON.stringify(allLogs, null, 2); // Adds indentation for better readability
        } catch (error) {
            console.error('Error fetching mission logs:', error);
            // Handle errors appropriately and return an error message in JSON format
            return JSON.stringify({ error: "Failed to fetch mission logs" });
        }
    }


    

    

    @Get("/mission-status")
    @ApiResponse({
        status: 200,
        description: 'The mission status',
        type: String
    })
    /**
     * Check the whole system status
     */
    async askStatus(): Promise<string> {
        this.log.info(`${this.logPrefix} Has been asked the mission status`);
        return await this.missionService.askMissionStatus();
    }

    @Get("/start-mission")
    @ApiResponse({
        status: 200,
        description: 'start the mission',
        type: MissionDto
    })
    /**
     * Check the whole system status and send go command
     * to the rocket launcher if everything is ready
     */
    async startMission(): Promise<Observable<MissionDto>> {
        try {
            const status = await this.missionService.launchRocket(false,false);

            if (status == "go") {
                this.log.info(`${this.logPrefix} Everything is good. The mission start`);
            } else {
                this.log.error(`${this.logPrefix} Unable to start the mission. One or more service aren't ready`);
            }
            return of(new MissionDto({
                status: status
            }));
        } catch (error) {
            this.log.error("The process fail. Unable to start the mission. One or more service aren't ready. " + error);
            return of(new MissionDto({
                status: "no go"
            }));
        }
    }

    

    @Get("/start-mission-failure")
    @ApiResponse({
        status: 200,
        description: 'start the mission with a failure',
        type: MissionDto
    })
    /**
     * Check the whole system status and send go command
     * to the rocket launcher if everything is ready
     */
    async startMissionWithFailure(): Promise<Observable<MissionDto>> {
        try {
            const status = await this.missionService.launchRocket(true,false);

            if (status == "go") {
                this.log.info(`${this.logPrefix} Everything is good. The mission start`);
            } else {
                this.log.error(`${this.logPrefix} Unable to start the mission. One or more service aren't ready`);
            }
            return of(new MissionDto({
                status: status
            }));
        } catch (error) {
            this.log.error("The process fail. Unable to start the mission. One or more service aren't ready. " + error);
            return of(new MissionDto({
                status: "no go"
            }));
        }
    }

    @Get("/start-mission-failure-auto-destruction")
    @ApiResponse({
        status: 200,
        description: 'start the mission with a failure',
        type: MissionDto
    })
    /**
     * Check the whole system status and send go command
     * to the rocket launcher if everything is ready
     */
    async startMissionWithFailureAutoDestruction(): Promise<Observable<MissionDto>> {
        try {
            const status = await this.missionService.launchRocket(true,true);

            if (status == "go") {
                this.log.info(`${this.logPrefix} Everything is good. The mission start`);
            } else {
                this.log.error(`${this.logPrefix} Unable to start the mission. One or more service aren't ready`);
            }
            return of(new MissionDto({
                status: status
            }));
        } catch (error) {
            this.log.error("The process fail. Unable to start the mission. One or more service aren't ready. " + error);
            return of(new MissionDto({
                status: "no go"
            }));
        }
    }

    @Get("check-if-mission-is-finished")
    async checkIfMissionIsFinished(): Promise<string> {
        return JSON.stringify(this.logsService.checkFinished());
    }

    @Post("rocket-auto-destruction-event")
    async getRocketDestructionEvent(): Promise<string> {
        let log = new LogsDTO("rocketEvent", "auto destruction","rocket");
        this.logsService.pushLog(log);
        this.log.info(`${this.logPrefix} the rocket performed auto destruction`);
        return "Rocket performed auto destruction";
    }

    @Post("rocket-anomaly-event")
    async getRocketAnomalyEvent(): Promise<string> {
        const log = new LogsDTO("rocketEvent", "anomaly", "rocket");
        this.logsService.pushLog(log);

        // Pink color ANSI escape sequence
        const pinkColor = '\x1b[35m';
        const resetColor = '\x1b[0m';

        this.log.info(`${pinkColor}${this.logPrefix} RECEIVED ANOMALY FROM ROCKET BUT IT IS NOT CIRITICAL${resetColor}`);
        return "RECEIVED ANOMALY FROM ROCKET";
    }







}
