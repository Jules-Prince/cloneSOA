import {ILogObj, Logger} from "tslog";
import {RocketService} from "../rocket.service";
import {Controller, Get} from "@nestjs/common";
import {HeightDTO} from "../entities/rocket/dto/Height.dto";
@Controller()
export class RocketPayloadController {

    private readonly log: Logger<ILogObj> = new Logger();
    constructor(private readonly appService: RocketService) {}

    @Get('payload')
     getPayload(): Promise<HeightDTO> {
        return this.appService.confirmWithPayload();

    }


}
