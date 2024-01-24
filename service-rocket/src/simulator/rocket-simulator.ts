import { State } from "./state";
import { HeightSensor } from "./sensors/height-sensor";
import { HealthSensor } from "./sensors/health-sensor";
import { Stages } from "./parts/stages";
import { RocketStateDTO } from "./dto/rocketState.dto";
import { Logger, ILogObj } from "tslog";
import {SpeedSensor} from "./sensors/speed-sensor";
import {Engine} from "./parts/engine";
import {InclineSensor} from "./sensors/incline-sensor";

import {RocketEventsEnum} from "../rocket.events.enum";
import {EventRocketDto} from "../entities/rocket/dto/event.rocket.dto";
import axios from "axios";

import {TemperatureSensor} from "./sensors/temperature-sensor";
import {PressureSensor} from "./sensors/pressure-sensor";
import { RocketService } from '../rocket.service';
import {timer} from "rxjs";
import {response} from "express";

export class RocketSimulator {

    private readonly logger : Logger<ILogObj> = new Logger();

    private _state: string = State.Ready2Launch;
    private _stage2WasEjected = false
    public  auto: boolean = false;
    set stage2WasEjected(value: boolean) {
        this._stage2WasEjected = value;
    }

    private _willFail: boolean = false;

    //parts
    private engine: Engine = new Engine();
    private stages:Stages = new Stages();

    //sensors
    private _heightSensor = new HeightSensor();
    private healthSensor = new HealthSensor();
    private speedSensor = new SpeedSensor();
    private inclineSensor = new InclineSensor();
    private temperatureSensor = new TemperatureSensor();
    private pressureSensor = new PressureSensor();
    public anomaly = 0;

    public acceleration: number = 17.8;
    private timeSinceLaunch:number = 0;

    private maxQ: number = 20046.02;
    private _isMaxQReached: boolean = false;
    private _isReadyToLaunch: boolean;
    private tag789:boolean = true;

    private tag1011: boolean = true;
    private MISSION_COMMANDER_URL = "";
    private WEB_CASTER_URL = "";

    public TELEMETRY_URL = "";


    private readonly logPrefix = "[Rocket Simulator]";


    constructor(TELEMETRY_URL: string) {
        this.TELEMETRY_URL = TELEMETRY_URL;
    }

    get isMaxQReached(): boolean {
        return this._isMaxQReached;
    }

    set isMaxQReached(value: boolean) {
        this._isMaxQReached = value;
    }

    get isReadyToLaunch(): boolean {
        this.isReadyToLaunch = this.state == State.Ready2Launch;
        return this._isReadyToLaunch;
    }


    set isReadyToLaunch(value: boolean) {
        this._isReadyToLaunch = value;
    }

    get heightSensor(): HeightSensor {
        return this._heightSensor;
    }

    async startSimulator(aimHeight: number = 20000){
        this.engine.startEngine();
        this.state = State.Launched;
        const timer = setInterval(async () => {
            this.acceleration = 17.8;
            this.timeSinceLaunch += 1;
            this.anomaly +=1;

            this.inclineRocket();

            if ((!this.stages.isTanksEmpty() || this._stage2WasEjected) && this.tag1011) {
                this.state = State.NoFuel;
                this.stopRocket(timer);
                this.postEvent(RocketEventsEnum.FairingSeparation, 10);
                this.sleep(2000);

                this.postEvent(RocketEventsEnum.SecondEngineCutOff, 11);
                this.sleep(2000);
                this.tag1011 = false;


            }

            if(this.stages.isStage1IsEmpty() && this.tag789){
                await this.postEvent(RocketEventsEnum.MainEngineCutOff, 7);
                this.sleep(2000);
                await this.postEvent(RocketEventsEnum.StageSeparation, 8);
                this.sleep(2000);
                await this.postEvent(RocketEventsEnum.SecondEngineStart, 9);
                this.sleep(2000);
                this.tag789 = false;
            }

            this.temperatureSensor.mesureTemp(this.heightSensor.currentHeight);
            this.pressureSensor.mesurePressure(this.heightSensor, this.temperatureSensor);

            this.checkMaxQ();

            this.speedSensor.updateSpeed(this.acceleration);

            this._heightSensor.move(this.speedSensor.currentSpeed, this.timeSinceLaunch);

            if (this._heightSensor.currentHeight >= 10000)
                this.healthSensor.suffersDamage()

            this.checkRocketState(timer, aimHeight)

        }, 500);

    }

    checkRocketState(timer, aimHeight) {
        if(this._heightSensor.currentHeight >= 10000){
            this.state = State.InSpace;
        }

        if(this._heightSensor.currentHeight >= aimHeight) {
            this.state = State.InPlace;
            this.stopRocket(timer);
        }
    }

    inclineRocket(){
        let newInclinaison = 0;
        if(this.willFail){
            newInclinaison += 1;
        }
        else{
            newInclinaison = Math.random() >= 0.5 ? 0.5 : -0.5;
        }

        this.inclineSensor.currentInclinaison += newInclinaison;
    }

    stopRocket(timer) {
        this.engine.stopEngine();
        clearInterval(timer);
    }

    get willFail(): boolean {
        return this._willFail;
    }

    set willFail(value: boolean) {
        this._willFail = value;
    }

    get state(): string {
        return this._state;
    }

    set state(value: string) {
        this._state = value;
    }

    public showMyMetrics(): RocketStateDTO{


        return new RocketStateDTO(this.stages.showStages(),
            this.speedSensor.currentSpeed,
            this._heightSensor.currentHeight,
            this.inclineSensor.currentInclinaison,
            this.healthSensor.health,
            this.state,
            this.pressureSensor.atmosphericPressure,
            this.pressureSensor.densityAtmospheric,
            this.temperatureSensor.actualTemperatureOutside,
            RocketService.rocketName
          );
    }

    async sleep(ms: number): Promise<void> {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }


    private async checkMaxQ() {
        const currentQ = (1/2) * this.pressureSensor.densityAtmospheric * Math.pow(this.speedSensor.currentSpeed,2)
        if (currentQ >= this.maxQ && !this.isMaxQReached) {
            await this.postEvent(RocketEventsEnum.MaxQ, 8);
            this.sleep(2000);
            this.isMaxQReached = true;
            this.logger.info(`${RocketService.logPrefix}MAX Q HAS BEEN REACHED`);
        }
    }

    isTheStage1IsDone(){
        return this.stages.showStages()[0].currentFuel <= 0;
    }

    isTheStage2IsDone(){
        return this.stages.showStages()[1].currentFuel <= 0;
    }

    private async postEvent(rocketEvents: RocketEventsEnum, id: number) {
        this.logger.info(`${RocketService.logPrefix} event : ` + rocketEvents);

        const eventDto: EventRocketDto = new EventRocketDto(id, rocketEvents, Date.now());

        try {
            const response = await axios.post(this.TELEMETRY_URL + "/event/rocket", eventDto);
            this.logger.info(`${RocketService.logPrefix}Response:`, response.data);
        } catch (error) {
            this.logger.error(`${RocketService.logPrefix}Error:`, error);
        }
    }
}
