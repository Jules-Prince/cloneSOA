
export class InclineSensor{
    private _currentInclinaison: number

    constructor() {
        this._currentInclinaison = 0;
    }


    get currentInclinaison(): number {
        return this._currentInclinaison;
    }


    set currentInclinaison(value: number) {
        this._currentInclinaison = value;
    }
}