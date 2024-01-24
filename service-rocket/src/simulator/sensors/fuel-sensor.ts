import { Logger } from '@nestjs/common';

export class FuelSensor {
    private value: number = 100;
    private readonly logger = new Logger(FuelSensor.name);

    /**
     * 
     * @returns 
     */
    public fuelConsumption(): boolean {
        if (this.value <= 0) {
            return false;
        }

        this.value = Math.max(this.value - 5, 0);
        return true;
    }

    public whatIsMyFuelLevel():number{
        return this.value
    }

    public isEmpty():boolean{
        return this.value <= 0;

    }
}