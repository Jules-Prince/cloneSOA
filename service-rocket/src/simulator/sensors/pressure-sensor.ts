import {HeightSensor} from "./height-sensor";
import {TemperatureSensor} from "./temperature-sensor";

export class PressureSensor {

    private _atmosphericPressure: number;
    private _densityAtmospheric: number;

    constructor() {
        this._atmosphericPressure = 53645.8;
        this._densityAtmospheric = 55232.44;
    }

    get atmosphericPressure(): number {
        return this._atmosphericPressure;
    }

    set atmosphericPressure(value: number) {
        this._atmosphericPressure = value;
    }


    get densityAtmospheric(): number {
        return this._densityAtmospheric;
    }

    set densityAtmospheric(value: number) {
        this._densityAtmospheric = value;
    }

    mesurePressure(heightSensor: HeightSensor, tempSensor: TemperatureSensor) {
        this.atmosphericPressure = -1.06 * heightSensor.currentHeight + 53773;
        this.densityAtmospheric = this.atmosphericPressure + (120*(tempSensor.actualTemperatureOutside-tempSensor.ISATemperature));
    }


}