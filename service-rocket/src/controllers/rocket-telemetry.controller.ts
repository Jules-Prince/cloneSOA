import {Controller, Get} from "@nestjs/common";
import {ILogObj, Logger} from "tslog";
import {RocketService} from "../rocket.service";
import {RocketStateDTO} from "../simulator/dto/rocketState.dto";

@Controller()
export class RocketTelemetryController {

    private readonly log: Logger<ILogObj> = new Logger();
    constructor(private appService: RocketService) {}

    @Get('metrics')
    getMetrics(): Promise<RocketStateDTO> {
        return this.appService.sendMetrics();
    }


}
