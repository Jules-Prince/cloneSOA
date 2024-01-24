import {Controller, Get} from '@nestjs/common';
import {LaboratoryService} from './laboratory.service';

@Controller()
export class LaboratoryController {
    constructor(private readonly appService: LaboratoryService) {
    }

    @Get('/start-experiment')
    startExperiment(): any {
        return this.appService.startExperiment();
    }

    @Get('/stop-experiment')
    stopExperiment(): any {
        return this.appService.stopExperiment();
    }
}
