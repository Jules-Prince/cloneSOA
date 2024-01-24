export class SpeedSensor {
    private _currentSpeed: number = 0;

    set currentSpeed(value: number) {
        this._currentSpeed = value;
    }

    get currentSpeed(): number {
        return this._currentSpeed;
    }

    updateSpeed(acceleration) {
        this.currentSpeed += acceleration;
        this.currentSpeed = Math.round(this.currentSpeed * 100) / 100;
    }
}