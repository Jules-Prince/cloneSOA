export class TemperatureSensor {

    private _actualTemperatureOutside: number; //Degrés en Celsius
    private _ISATemperature: number;

    constructor() {
        this._actualTemperatureOutside = 15;
    }

    get actualTemperatureOutside(): number {
        return this._actualTemperatureOutside;
    }

    set actualTemperatureOutside(value: number) {
        this._actualTemperatureOutside = value;
    }


    get ISATemperature(): number {
        return this._ISATemperature;
    }

    set ISATemperature(value: number) {
        this._ISATemperature = value;
    }

    mesureTemp(currentHeight) {
        this.actualTemperatureOutside = 15 - 1.98 * currentHeight / 1000;
        this.computeISATemp();
    }

    computeISATemp() {
        this.ISATemperature = this.actualTemperatureOutside - this.actualTemperatureOutside;
    }



}