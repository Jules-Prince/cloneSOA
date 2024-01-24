
export class Engine {
    private _isRunning: boolean
    public maxAcceleration: number = 3.12;
    public maxSpeed: number = 2000;

    constructor() {
        this._isRunning = false;
    }

    get isRunning(): boolean {
        return this._isRunning;
    }


    set isRunning(value: boolean) {
        this._isRunning = value;
    }

    startEngine() {
        this.isRunning = true
    }

    stopEngine() {
        this.isRunning = false
    }
}