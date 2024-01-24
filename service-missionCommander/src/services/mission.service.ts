import {Injectable} from "@nestjs/common";
import {ApiService} from "./api.service";
import {ILogObj, Logger} from "tslog";
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { CassandraService } from './logs.service';

@Injectable()
export class MissionService {
    
    private readonly log: Logger<ILogObj> = new Logger();
    private readonly logPrefix = "[Mission status]";



    constructor(private readonly apiService: ApiService ,  private http: HttpService, private cassandraService : CassandraService ) {}

    async askMissionStatus(): Promise<string> {
        this.log.info(`${this.logPrefix} Get the weather status`);
        const weatherStatus = await this.apiService.getWeatherStatus();
        this.log.info(`${this.logPrefix} Get the rocket status`);
        const rockerStatus = await this.apiService.getRocketStatus();

        if (weatherStatus == "go" && rockerStatus == "go") {
            this.log.info(`${this.logPrefix} Weather and rocket are ready`);
            return "go";
        }

        this.log.info(`${this.logPrefix} Weather and/or rocket aren't ready`);
        return "no go";
    }

    async launchRocket(failure = false,auto=false) : Promise<string> {
        if (await this.askMissionStatus() == "go") {
            const rockerLauncherStatus = await this.apiService.launchRocket(failure,auto);
            if (rockerLauncherStatus == "go") {
                return "go"
            }
        } else {
            return "no go"
        }
    }

    async sendOrderOfDestruction(){
        await axios.post(process.env.ROCKET_URL + "/destruct", {message: "destruct_rocket"});
    }

    getLogs() {
        return this.cassandraService.getData();
    }

    

}
