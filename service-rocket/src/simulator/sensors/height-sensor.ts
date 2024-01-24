export class HeightSensor {

    private _currentHeight: number = 120;

    get currentHeight(): number {
        return this._currentHeight;
    }

    set currentHeight(value: number) {
        this._currentHeight = value;
    }

    /**
     * Si la rocket atteind =+ 20 000, elle a etteind la bonne hauteur pour le largage.
     * Revoit true si point atteind, sinon revoit false.
     * @returns
     */
    move(currentSpeed, currentTime) {
        this.currentHeight = currentSpeed * currentTime;
        this.currentHeight = Math.round(this.currentHeight * 100) / 100
    }

}
