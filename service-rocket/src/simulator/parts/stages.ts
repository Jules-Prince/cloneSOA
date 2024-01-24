import { FuelSensor } from "../sensors/fuel-sensor";
import { RocketStages } from "../dto/rocketState.dto";
import { Logger } from '@nestjs/common';

export class Stages{
    private readonly logger = new Logger(Stages.name);
    private stage1:FuelSensor = new FuelSensor();
    private stage2:FuelSensor = new FuelSensor();

    public isTanksEmpty():boolean {
        if( ! this.stage1.isEmpty()){
            this.stage1.fuelConsumption()
            return true;
        }
        return this.stage2.fuelConsumption()
    }

    public isStage1IsEmpty():boolean{
        return this.stage1.isEmpty();
    }

    public showStages():RocketStages[]{
        return [new RocketStages(1, this.stage1.whatIsMyFuelLevel()), new RocketStages(2, this.stage2.whatIsMyFuelLevel())];
    }
}