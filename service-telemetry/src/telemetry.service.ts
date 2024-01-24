/* eslint-disable prettier/prettier */
import {Injectable} from '@nestjs/common';
import {Telemetry} from "./Telemetry";
import {ILogObj, Logger} from "tslog";
import * as process from 'process';
import axios from 'axios';
import {RocketStatusDTO} from "./RocketStatusDTO";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Metrics, MetricsDocument} from "./schemas/metrics.schema"
import {MetricsStage, MetricsStageDocument} from "./schemas/metrics.stage.schema";
import {StageStatusDTO} from "./stageStatusDTO";
import {Stage} from "./stage";
import { KafkaService } from './kafka/kafka.service';


@Injectable()
export class TelemetryService {
    public readonly log: Logger<ILogObj> = new Logger();

    static readonly logPrefix: string = "[Telemetry]";

    private cpt:number = 0;
    private cpt2:number = 0;
    private cpt3:number = 0;

    private _telemetry = new Telemetry();
    private telemetryStage = false;
    private telemetryStage2 = false;
    private rocketName:string = ""

    constructor(
        @InjectModel(Metrics.name) private metricsmodel: Model<MetricsDocument>,
        @InjectModel(MetricsStage.name) private metricsstagemodel: Model<MetricsStageDocument>,
        private readonly kafkaService: KafkaService
    ) {
    }

    get telemetry(): Telemetry {
        return this._telemetry;
    }

    startTelemetry(): string {
        this.log.info(`${TelemetryService.logPrefix} Has been asked to start the telemetry`);
        return this.start();
    }

    startTelemetryStage1(): string {
        this.log.info(`${TelemetryService.logPrefix} Has been asked to start the stage telemetry`);
        return this.startStage1();
    }

    startTelemetryStage2(): string {
        this.log.info(`${TelemetryService.logPrefix} Has been asked to start the stage telemetry`);
        return this.startStage2();
    }

    stopTelemetry(): string {
        this.log.info(`${TelemetryService.logPrefix} Has been asked to stop the telemetry`);
        return this.stop();
    }

    public startStage1() {
        if (!this.telemetryStage) {
            this.log.info(`${TelemetryService.logPrefix}  Service loop Stage is starting`);
            this.telemetryStage = true;
            this.startTimerStage1();
            return "Telemetry started";
        } else {
            this.log.info(`${TelemetryService.logPrefix} Service loop Stage is already started`);
            return "Error";
        }
    }

    public startStage2() {
        if (!this.telemetryStage2) {
            this.log.info(`${TelemetryService.logPrefix}  Service loop Stage is starting`);
            this.telemetryStage2 = true;
            this.startTimerStage2();
            return "Telemetry started";
        } else {
            this.log.info(`${TelemetryService.logPrefix} Service loop Stage is already started`);
            return "Error";
        }
    }

    public start() {
        if (!this.telemetry.isRunning) {
            this.log.info(`${TelemetryService.logPrefix}  Service is starting`);
            this.telemetry.isRunning = true;
            this.startTimer();
            return "Telemetry started";
        } else {
            this.log.info(`${TelemetryService.logPrefix} Service is already started`);
            return "Error";
        }
    }

    public stop() {
        if (this.telemetry.isRunning) {
            this.log.info(`${TelemetryService.logPrefix} Selemetry service is stopping`);
            this.telemetry.isRunning = false;
            return "Telemetry stopped";
        } else {
            this.log.info(`${TelemetryService.logPrefix} Selemetry service is already stopped`);
            return "Error";
        }
    }

    async startTimer() {
        this.log.info(`${TelemetryService.logPrefix} Wait 5s before monitor the rocket status`)
        const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        await sleep(5000);

        const intervalMs = Telemetry.DELAY;

        let start = process.hrtime.bigint();
        let elapsedMs = 0;

        const loop = async () => {
            if (!this.telemetry.isRunning) {
                return; // Exit the loop if the flag is false
            }
            const current = process.hrtime.bigint();
            elapsedMs = Number(current - start) / 1e6; // Convert to milliseconds

            if (elapsedMs >= intervalMs) {
                await this.askRocketIsStatus();
                start = current;
            }

            // @ts-ignore
            setImmediate(loop);
        };

        loop();
    }


    async checkAnomaly(metrics: Metrics) {
        if(metrics.incline >= 20 ) {
            this.log.info(`${TelemetryService.logPrefix} Incline is too high`);
            await this.kafkaService.emitMessage("monitoring","anomaly", "Rocket-anomaly");
            console.log("Rocket is destroyed : stopped telemetry");
            this.stopTelemetry();
        }
        
        //await axios.post(process.env.MISSION_COMMANDER_URL + '/anomaly', metrics);
        
    }


    startTimerStage1() {
        const intervalMs = Telemetry.DELAY;

        let start = process.hrtime.bigint();
        let elapsedMs = 0;

        const loop = async () => {
            if (!this.telemetryStage) {
                return; // Exit the loop if the flag is false
            }
            const current = process.hrtime.bigint();
            elapsedMs = Number(current - start) / 1e6; // Convert to milliseconds

            if (elapsedMs >= intervalMs) {
                await this.askStage1IsStatus();
                start = current;
            }

            // @ts-ignore
            setImmediate(loop);
        };

        loop();
    }

    startTimerStage2() {
        const intervalMs = Telemetry.DELAY;

        let start = process.hrtime.bigint();
        let elapsedMs = 0;

        const loop = async () => {
            if (!this.telemetryStage2) {
                return; // Exit the loop if the flag is false
            }
            const current = process.hrtime.bigint();
            elapsedMs = Number(current - start) / 1e6; // Convert to milliseconds

            if (elapsedMs >= intervalMs) {
                await this.askStage2IsStatus();
                start = current;
            }

            // @ts-ignore
            setImmediate(loop);
        };

        loop();
    }

    async askStage1IsStatus() {
        if((this.cpt % 10) == 0) {
            this.log.info(`${TelemetryService.logPrefix} Is asking to Stage is status`)
        }
        const url = process.env.STAGE1_URL + "/stage1/metrics";

        const response = await axios.get(url);

        const stageStatusDTO = new StageStatusDTO();
        Object.assign(stageStatusDTO, response.data);
        


        const stage:Stage = new Stage(stageStatusDTO.height, this.rocketName+stageStatusDTO.name, stageStatusDTO.parachute, stageStatusDTO.state);
        
        if(stage.height <= 0){
            this.telemetryStage = false
        }
        
        this.kafkaService.emitMessage("monitoring","stage1-metrics", JSON.stringify(stageStatusDTO));


        const metrics = new MetricsStage(stage.name, stage.height, stage.parachute, stage.state);
        this.metricsstagemodel.create(metrics);
        await this.metricsstagemodel.find().lean();

        if((this.cpt % 10) == 0 || !
            this.telemetryStage) {
            this.log.info(`${TelemetryService.logPrefix} --------------------New Metrics-------------------- STAGE`);
            this.log.info(`${TelemetryService.logPrefix} Stage Status  :`);
            this.log.info(`${TelemetryService.logPrefix} - Stage name : ${stage.name}`);
            this.log.info(`${TelemetryService.logPrefix} - Stage height : ${parseInt(stage.height.toString())}`);
            this.log.info(`${TelemetryService.logPrefix} - Stage parachute : ${stage.parachute}`);
            this.log.info(`${TelemetryService.logPrefix} - Stage state : ${stage.state}`);
        }

        this.cpt += 1;

        //if(this.cpt >= 1000) this.cpt = 0;
    }


    async askStage2IsStatus() {
        if((this.cpt3 % 10) == 0) {
            this.log.info(`${TelemetryService.logPrefix} Is asking to Stage is status`)
        }
        const url = process.env.STAGE2_URL + "/stage2/metrics";

        const response = await axios.get(url);

        const stageStatusDTO = new StageStatusDTO();
        Object.assign(stageStatusDTO, response.data);

        const stage:Stage = new Stage(stageStatusDTO.height, this.rocketName+stageStatusDTO.name, stageStatusDTO.parachute, stageStatusDTO.state);

        if(stage.height <= 0){
            this.telemetryStage2 = false
        }

        this.kafkaService.emitMessage("monitoring","stage2-metrics", JSON.stringify(stageStatusDTO));


        const metrics = new MetricsStage(stage.name, stage.height, stage.parachute, stage.state);
        this.metricsstagemodel.create(metrics);
        await this.metricsstagemodel.find().lean();

        if((this.cpt3 % 10) == 0 || !
            this.telemetryStage) {
            this.log.info(`${TelemetryService.logPrefix} --------------------New Metrics-------------------- STAGE`);
            this.log.info(`${TelemetryService.logPrefix} Stage Status  :`);
            this.log.info(`${TelemetryService.logPrefix} - Stage name : ${stage.name}`);
            this.log.info(`${TelemetryService.logPrefix} - Stage height : ${parseInt(stage.height.toString())}`);
            this.log.info(`${TelemetryService.logPrefix} - Stage parachute : ${stage.parachute}`);
            this.log.info(`${TelemetryService.logPrefix} - Stage state : ${stage.state}`);
        }

        this.cpt3 += 1;

        //if(this.cpt >= 1000) this.cpt = 0;
    }

    async askRocketIsStatus() {
        if((this.cpt2 % 10) == 0) {
            this.log.info(`${TelemetryService.logPrefix} Is asking to Rocket is status`)
        }
        const url = process.env.ROCKET_URL + "/metrics";

        const response = await axios.get(url);

        const rocketStatusDTO = new RocketStatusDTO();
        Object.assign(rocketStatusDTO, response.data);

        // push in kafka 

        this.kafkaService.emitMessage("monitoring","rocket-metrics", JSON.stringify(rocketStatusDTO));
        
        const metrics = new Metrics(rocketStatusDTO.height,
            rocketStatusDTO.speed,
            rocketStatusDTO.incline,
            rocketStatusDTO.life,
            rocketStatusDTO.state,
            rocketStatusDTO.rocketStatus,
            rocketStatusDTO.atmosphericPressure,
            rocketStatusDTO.densityPressure,
            rocketStatusDTO.temperature,
            rocketStatusDTO.rocketName
        );

        this.rocketName = rocketStatusDTO.rocketName;

        this.metricsmodel.create(metrics);
        await this.metricsmodel.find().lean();
        await this.checkAnomaly(metrics);

        if((this.cpt2 % 10) == 0) {
            this.log.info(`${TelemetryService.logPrefix} --------------------New Metrics-------------------- ROCKET`);
            this.log.info(`${TelemetryService.logPrefix} Rocket Status  :`);
            this.log.info(`${TelemetryService.logPrefix} - Stage ${rocketStatusDTO.rocketStatus[0].stage} Fuel : ${rocketStatusDTO.rocketStatus[0].currentFuel}%`);
            this.log.info(`${TelemetryService.logPrefix} - Stage ${rocketStatusDTO.rocketStatus[1].stage} Fuel : ${rocketStatusDTO.rocketStatus[1].currentFuel}%`);
            this.log.info(`${TelemetryService.logPrefix} - Current Height : ${rocketStatusDTO.height} km`);
            this.log.info(`${TelemetryService.logPrefix} - Current Speed : ${rocketStatusDTO.speed} m/s`);
            this.log.info(`${TelemetryService.logPrefix} - Current atmospheric pressure : ${rocketStatusDTO.atmosphericPressure/100} hPa`);
            this.log.info(`${TelemetryService.logPrefix} - Current density atmospheric: ${rocketStatusDTO.densityPressure} kg/m3`);
            this.log.info(`${TelemetryService.logPrefix} - Current temperature : ${rocketStatusDTO.temperature} C°`);
            this.log.info(`${TelemetryService.logPrefix} - Incline : ${rocketStatusDTO.incline}`);
            this.log.info(`${TelemetryService.logPrefix} - Remaining Life : ${rocketStatusDTO.life}%`);
            this.log.info(`${TelemetryService.logPrefix} - State : ${rocketStatusDTO.state}`);
            this.log.info(`${TelemetryService.logPrefix} ---------------------------------------------------`);
        }

        this.cpt2 += 1;

        //if(this.cpt2 >= 1000) this.cpt2 = 0;
    }


}
