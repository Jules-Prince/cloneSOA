import {ILogObj, Logger} from "tslog";

export class Telemetry {
    private readonly log: Logger<ILogObj> = new Logger();

    public static DELAY: number = 100;

    private _isRunning: boolean;

    constructor() {
        this._isRunning = false;
    }

    public get isRunning(): boolean {
        return this._isRunning;
    }


    public set isRunning(value: boolean) {
        this._isRunning = value;
    }

}
