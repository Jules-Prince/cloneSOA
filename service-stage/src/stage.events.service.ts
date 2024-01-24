/* eslint-disable prettier/prettier */
import {HttpService} from "@nestjs/axios";
import axios from "axios";
import {EventStageDto} from "./dto/event.stage.dto";
import {StageEventsEnum} from "./stage.events.enum"

export class StageEventsService{
    private _heightMax = 0;
    private readonly logPrefix = "[Stage]";

    private filpManeuver:boolean = false;
    private entryBurn:boolean = false;
    private guidance:boolean = false;
    private landingBurn:boolean = false;
    private landingLegsDeployed:boolean = false;
    private landing:boolean = false;

    constructor(private http: HttpService) {

    }

    set heightMax(value: number) {
        this._heightMax = value;
    }

    async sleep(ms: number): Promise<void> {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }

    async isEventSendIt(height:number){
        if((((height * 100)/this._heightMax) <= 100) && ! this.filpManeuver){ // 100%
            this.filpManeuver = true;
            await this.postEvent(StageEventsEnum.FilpManeuver, 1)
            this.sleep(2000);
        }
        if((((height * 100)/this._heightMax) <= 80) && ! this.entryBurn){ // 80%
            this.entryBurn = true;
            await this.postEvent(StageEventsEnum.EntryBurn, 2)
            this.sleep(2000);

            
        }
        if(((height * 100)/this._heightMax) <= 60 && ! this.guidance){ // 60%
            this.guidance = true;
            await this.postEvent(StageEventsEnum.Guidance, 3)
            this.sleep(2000);

        }
        if(((height * 100)/this._heightMax) <= 40 && ! this.landingBurn){
            this.landingBurn = true;
            await this.postEvent(StageEventsEnum.LandingBurn, 4)
            this.sleep(2000);

        }
        if(((height * 100)/this._heightMax) <= 25 && ! this.landingLegsDeployed){
            this.landingLegsDeployed = true;
            await this.postEvent(StageEventsEnum.LandingLegsDeployed, 5)
            this.sleep(2000);

        }
        if(((height * 100)/this._heightMax) <= 10 && ! this.landing){
            this.landing = true;
            await this.postEvent(StageEventsEnum.Landing, 6)
            this.sleep(2000);

        }
    }

    private async postEvent(stageEvents: StageEventsEnum, id: number) {
        console.log(`${this.logPrefix} event : ` + stageEvents);

        const eventDto: EventStageDto = new EventStageDto(id, stageEvents, Date.now());

        try {
            const response = await axios.post(process.env.TELEMETRY_URL + "/event/stage", eventDto);
            console.log("Response:", response.data);
        } catch (error) {
            console.error("Error:", error);
        }

        //try {
          //  const response = await axios.post(process.env.WEB_CASTER_URL + "/event/stage", eventDto);
           // console.log("Response:", response.data);
        //} catch (error) {
          //  console.error("Error:", error);
        //}
    }
}