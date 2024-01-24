import {ClassSerializerInterceptor, Injectable, UseInterceptors} from '@nestjs/common';
import {RocketStatusDto} from "./entities/rocket/dto/rocketStatus.dto";
import {LaunchStatusDto} from "./entities/launcher/dto/launchStatus.dto";
import {HttpService} from "@nestjs/axios";
import * as process from "process";
import {lastValueFrom, map} from "rxjs";
import {ILogObj, Logger} from "tslog";
import {RocketSimulator} from "./simulator/rocket-simulator";
import {RocketStateDTO} from "./simulator/dto/rocketState.dto";
import {HeightDTO} from "./entities/rocket/dto/Height.dto";
import axios from "axios";

import {StageDto} from "./entities/launcher/dto/stage.dto";
import {State} from "./simulator/state";
import {RocketEventsEnum} from "./rocket.events.enum";
import {EventRocketDto} from "./entities/rocket/dto/event.rocket.dto";
import { KafkaService } from './kafka/kafka.service';
import { setMaxIdleHTTPParsers } from 'http';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class RocketService {
    static rocketName = '';
    static logPrefix = `[Rocket ${RocketService.rocketName}] `;
    private readonly log: Logger<ILogObj> = new Logger();


    private rocket = new RocketSimulator(process.env.TELEMETRY_URL);
    stageStarter:boolean = true;
    stage2Starter:boolean = true;

    constructor(private http: HttpService , private readonly KafkaService: KafkaService) {
    }

    async sleep(ms: number): Promise<void> {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }

    async getRocketStatus(): Promise<RocketStatusDto> {
        this.rocket = new RocketSimulator(this.rocket.TELEMETRY_URL);

        if (this.rocket.isReadyToLaunch) {
            this.log.info(`${RocketService.logPrefix} The rocket is ready to be launch`);
            //await this.postEvent(RocketEventsEnum.RocketPreparation, 1);
            // kafka 
            await this.KafkaService.emitMessage('launch', 'rocketEvent-RocketPreparation', RocketEventsEnum.RocketPreparation)
            this.sleep(2000);
            //await this.postEvent(RocketEventsEnum.RocketOnInternalPower, 2);
            //kafka
            await this.KafkaService.emitMessage('launch', 'rocketEvent-RocketOnInternalPower', RocketEventsEnum.RocketOnInternalPower)
            this.sleep(2000);

            return new RocketStatusDto("go");
        } else
            return new RocketStatusDto("no_go");
    }

    async destructRocket(): Promise<String> {
        this.log.info(`${RocketService.logPrefix} The rocket is going to be destroyed`);
        this.log.info(`${RocketService.logPrefix} SELF DESTRUCTION `);
        this.log.info(`${RocketService.logPrefix} \n⣿⣿⣿⡟⠛⠻⣿⣿⣿⣿⣿⣿⣿⡟⠛⢛⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿
⣿⣿⣿⣿⣦⡀⠹⣿⣿⣿⣿⣿⣿⡇⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠋⠀⣿
⣿⣿⣿⣿⣿⣷⣄⠈⢿⣿⣿⣿⣿⡇⠀⣾⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁⠀⠀⠀⣿
⣿⣿⣿⣿⣿⣿⣿⣧⡀⢻⣿⣿⣿⡇⢠⣿⣿⡿⣿⣿⣿⡿⠋⠀⠀⠀⣀⣴⣾⣿
⣿⡏⠛⠿⣿⣿⣿⣿⣿⡆⠙⠋⠉⠁⠈⠉⠋⠰⣿⠟⠁⠀⢀⣤⣶⣿⣿⣿⣿⣿
⣿⡇⠀⠀⠀⠉⠛⠻⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣶⣶⣶⣤⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠛⠛⠛⣛⣻⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⡿⠿⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣷⣶⣶⣶⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⣄⡀⠀⠀⠀⠀⡀⢰⣶⣄⠀⠀⠀⠉⠙⠛⠿⢿⣿⣿
⣿⣿⣿⣿⣿⡿⠋⠀⢀⣾⣿⣿⠃⠀⠀⢿⣿⣮⣿⣿⣿⣦⣀⠀⠀⠀⠀⠀⠀⣿
⣿⣿⣿⡿⠋⠀⠀⢠⣿⣿⣿⣿⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⣿
⣿⡿⠋⠀⠀⠀⣰⣿⣿⣿⣿⡇⠀⠀⠀⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣀⠀⣿
⣿⡇⠀⠀⢀⣼⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿
⣿⣧⣤⣤⣾⣿⣿⣿⣿⣿⣿⣧⣤⣤⣤⣤⣤⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿`);
        await this.sendStopMetrics();
        this.log.info(`${RocketService.logPrefix} The rocket has been destroyed`);
        this.rocket = new RocketSimulator(this.rocket.TELEMETRY_URL);

        return "SELF DESTRUCTION IN 3... 2... 1...";
    }

    async launchRocket(failure:boolean = false,auto:boolean=false): Promise<LaunchStatusDto> {
        this.log.info(`${RocketService.logPrefix} Wait 5s before lift-off`)
        const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        await sleep(5000);

        this.log.info(`${RocketService.logPrefix} Send lift-off command to launcher`);



        //await this.postEvent(RocketEventsEnum.Startup, 3);
        await this.KafkaService.emitMessage('launch', 'rocketEvent-Startup', RocketEventsEnum.Startup)
        this.sleep(2000);

        //await this.postEvent(RocketEventsEnum.MainEngineStart, 4);
        await this.KafkaService.emitMessage('launch', 'rocketEvent-MainEngineStart', RocketEventsEnum.MainEngineStart)
        this.sleep(2000);

        //await this.postEvent(RocketEventsEnum.Liftoff, 5);
        await this.KafkaService.emitMessage('launch', 'rocketEvent-Liftoff', RocketEventsEnum.Liftoff)
        this.sleep(2000);


        const url = process.env.LAUNCHER_URL + "/lift-off";
        const response = await axios.get(url);
        const launchStatusDTO = new LaunchStatusDto();
        Object.assign(launchStatusDTO, response.data);
        this.rocket.willFail = failure;
        this.rocket.auto = auto;
        this.startSimulator();
        await this.startMetrics();

        return launchStatusDTO;
    }

    public async startMetrics() {
        this.log.info(`${RocketService.logPrefix} requests telemetry to start`);
        const url = process.env.TELEMETRY_URL + "/start";
        const request = this.http.get(url)
            .pipe(map((res) => res.data?.status));
        await lastValueFrom(request);
    }

    async sendMetrics(): Promise<RocketStateDTO> {
        if (this.rocket.state == State.InPlace) {
            await this.confirmWithPayload();
            await this.sendStopMetrics();
        } else if (this.rocket.state == State.NoFuel) {
            await this.sendStopMetrics();
        }

        if(this.rocket.isTheStage1IsDone() && this.stageStarter){
            this.startMetricsStage(process.env.STAGE1_URL, 1);
            this.stageStarter = false;
        }

        if(this.rocket.isTheStage2IsDone() && this.stage2Starter){ // Si stage 2 n'a plus de carburant
            this.startMetricsStage(process.env.STAGE2_URL,2);
            this.stage2Starter = false;
        }

        if(this.rocket.anomaly % 10==0){
            this.log.info(`${RocketService.logPrefix} ANOMALY DETECTED`);
            await axios.post(process.env.MISSION_COMMANDER_URL + "/rocket-anomaly-event");
        }

        if(this.rocket.showMyMetrics().incline>= 20 && this.rocket.auto == true){
            this.log.info(`${RocketService.logPrefix} We detected a severe incline, we will perform the AUTO DESTRUCTION`);
            this.log.info(`${RocketService.logPrefix}                                     ,----,                                                              ,----,                                           ,----,                                    
                                  ,/   .\`|  ,----..                                                   ,/   .\`|                                         ,/   .\`|            ,----..            ,--. 
   ,---,                        ,\`   .'  : /   /   \\              ,---,        ,---,.  .--.--.      ,\`   .'  :,-.----.                  ,----..      ,\`   .'  :   ,---,   /   /   \\         ,--.'| 
  '  .' \\               ,--,  ;    ;     //   .     :           .'  .' \`\\    ,'  .' | /  /    '.  ;    ;     /\\    /  \\           ,--, /   /   \\   ;    ;     /,\`--.' |  /   .     :    ,--,:  : | 
 /  ;    '.           ,'_ /|.'___,/    ,'.   /   ;.  \\        ,---.'     \\ ,---.'   ||  :  /\`. /.'___,/    ,' ;   :    \\        ,'_ /||   :     :.'___,/    ,' |   :  : .   /   ;.  \\,\`--.'\`|  ' : 
:  :       \\     .--. |  | :|    :     |.   ;   /  \` ;        |   |  .\`\\  ||   |   .';  |  |--\` |    :     |  |   | .\\ :   .--. |  | :.   |  ;. /|    :     |  :   |  '.   ;   /  \` ;|   :  :  | | 
:  |   /\\   \\  ,'_ /| :  . |;    |.';  ;;   |  ; \\ ; |        :   : |  '  |:   :  |-,|  :  ;_   ;    |.';  ;  .   : |: | ,'_ /| :  . |.   ; /--\` ;    |.';  ;  |   :  |;   |  ; \\ ; |:   |   \\ | : 
|  :  ' ;.   : |  ' | |  . .\`----'  |  ||   :  | ; | '        |   ' '  ;  ::   |  ;/| \\  \\    \`.\`----'  |  |  |   |  \\ : |  ' | |  . .;   | ;    \`----'  |  |  '   '  ;|   :  | ; | '|   : '  '; | 
|  |  ;/  \\   \\|  | ' |  | |    '   :  ;.   |  ' ' ' :        '   | ;  .  ||   :   .'  \`----.   \\   '   :  ;  |   : .  / |  | ' |  | ||   : |        '   :  ;  |   |  |.   |  ' ' ' :'   ' ;.    ; 
'  :  | \\  \\ ,':  | | :  ' ;    |   |  ''   ;  \\; /  |        |   | :  |  '|   |  |-,  __ \\  \\  |   |   |  '  ;   | |  \\ :  | | :  ' ;.   | '___     |   |  '  '   :  ;'   ;  \\; /  ||   | | \\   | 
|  |  '  '--'  |  ; ' |  | '    '   :  | \\   \\  ',  /         '   : | /  ; '   :  ;/| /  /\`--'  /   '   :  |  |   | ;\\  \\|  ; ' |  | ''   ; : .'|    '   :  |  |   |  ' \\   \\  ',  / '   : |  ; .' 
|  :  :        :  | : ;  ; |    ;   |.'   ;   :    /          |   | '\` ,/  |   |    \\'--'.     /    ;   |.'   :   ' | \\.':  | : ;  ; |'   | '/  :    ;   |.'   '   :  |  ;   :    /  |   | '\`--'   
|  | ,'        '  :  \`--'   \\   '---'      \\   \\ .'           ;   :  .'    |   :   .'  \`--'---'     '---'     :   : :-'  '  :  \`--'   \\   :    /     '---'     ;   |.'    \\   \\ .'   '   : |       
\`--''          :  ,      .-./               \`---\`             |   ,.'      |   | ,'                           |   |.'    :  ,      .-./\\   \\ .'                '---'       \`---\`     ;   |.'       
                \`--\`----'                                     '---'        \`----'                             \`---'       \`--\`----'     \`---\`                                        '---'         
                                                                                                                                                                                                   `);


            axios.post(process.env.MISSION_COMMANDER_URL + "/rocket-auto-destruction-event");
            this.destructRocket();
        }

        return this.rocket.showMyMetrics();
    }

    async startMetricsStage(uri:String, stageNb:number){
        this.log.info(`${RocketService.logPrefix} requests telemetry state start`);
        let url: string;
        if(stageNb == 1) {
            url = uri + "/stage1/start";
        }if(stageNb == 2){
            url = uri + "/stage2/start";
        }

        const stageDto:StageDto = new StageDto(this.rocket.heightSensor.currentHeight);

        try {
            await axios.post(url, stageDto);
            // Traitez la réponse ici
        } catch (error) {
            // Gérez les erreurs ici
            this.log.error(`Error while making POST request: ${error.message}`);
        }
    }

    async sendStopMetrics(){
        this.log.info(`${RocketService.logPrefix} requests telemetry to stop`);
        this.rocket = new RocketSimulator(this.rocket.TELEMETRY_URL);
        const url: string = process.env.TELEMETRY_URL + "/stop";
        await axios.get(url);
    }

    startSimulator() {
        this.rocket.startSimulator();
    }

    async confirmWithPayload(): Promise<HeightDTO> {
        if(this.stage2Starter){ // Si payload déployé et que le stage 2 n'est pas redescendu
            this.startMetricsStage(process.env.STAGE2_URL, 2);
            this.rocket.stage2WasEjected = true
        }

        //let height = new RocketSimulator(process.env.MISSION_COMMANDER_URL, process.env.WEB_CASTER_URL).heightSensor.currentHeight;
        let height = this.rocket.heightSensor.currentHeight

        await this.postEvent(RocketEventsEnum.PayloadSeparation, 12)

        const request = this.http.post(process.env.PAYLOAD_DEPARTMENT_URL + "/approve", new HeightDTO(height)).pipe(map((res) => res.data.command));
        const confirmation = await lastValueFrom(request);
        if (confirmation == "go") {
            this.log.info(`${RocketService.logPrefix} The payload confirmed the orbit , we can deliver the payload`);
            this.log.info(`${RocketService.logPrefix}` );
            this.log.info(`${RocketService.logPrefix}                }--O--{`);
            this.log.info(`${RocketService.logPrefix}                  [^]`);
            this.log.info(`${RocketService.logPrefix}                 /ooo\\`);
            this.log.info(`${RocketService.logPrefix} ______________:/o   o\\:______________`);
            this.log.info(`${RocketService.logPrefix}|=|=|=|=|=|=|:A|\`:|||:\`|A:|=|=|=|=|=|=|`);
            this.log.info(`${RocketService.logPrefix}^\"\"\"\"\"\"\"\"\"\"\"\"\"\"!::{o}::!\"\"\"\"\"\"\"\"\"\"\"\"\"\"^`);
            this.log.info(`${RocketService.logPrefix}                \\     /`);
            this.log.info(`${RocketService.logPrefix}                 \\.../`);
            this.log.info(`${RocketService.logPrefix}      ____       \`---\`       ____`);
            this.log.info(`${RocketService.logPrefix}     |\\/\\/|=======|*|=======|\\/\\/|`);
            this.log.info(`${RocketService.logPrefix}     :----\`       /-\\       \`----:`);
            this.log.info(`${RocketService.logPrefix}                 /ooo\\`);
            this.log.info(`${RocketService.logPrefix}                #|ooo|#`);
            this.log.info(`${RocketService.logPrefix}                 \\___/`);
            this.log.info(`${RocketService.logPrefix}`);

            this.log.info(`${RocketService.logPrefix} Demand to payload service to start simulation`);
            this.http.post(process.env.PAYLOAD_URL + "/start").subscribe();

            this.log.info(`${RocketService.logPrefix} Demand to payload department service to follow the payload move`);
            this.http.post(process.env.PAYLOAD_DEPARTMENT_URL + "/start-telemetry").subscribe();
        }
        else{
            this.log.info(`${RocketService.logPrefix} The payload didn't confirm the orbit , we can't deliver the payload`);
        }
        return new HeightDTO(height);

    }

    private async postEvent(rocketEvents: RocketEventsEnum, id: number) {
        const eventDto: EventRocketDto = new EventRocketDto(id, rocketEvents, Date.now());

        try {
            const response = await axios.post(process.env.TELEMETRY_URL + "/event/rocket", eventDto);
            this.log.info(`${RocketService.logPrefix}Response:`, response.data);
        } catch (error) {
            this.log.error(`${RocketService.logPrefix}Error:`, error);
        }

        /*try {
            const response = await axios.post(process.env.WEB_CASTER_URL + "/event/rocket", eventDto);
            this.log.info(`${RocketService.logPrefix}Response:`, response.data);
        } catch (error) {
            this.log.error(`${RocketService.logPrefix}Error:`, error);
        }*/
    }
}
