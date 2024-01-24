export class HealthSensor {
    private _health: number = 100;

    public suffersDamage() {
        const value:number = Math.floor((Math.random()*200)+1);

        if(value <= 2) {
            const damage = Math.floor(Math.random() * 5);
            this.health = this.health - damage
        }
    }

    get health(): number {
        return this._health;
    }


    set health(value: number) {
        this._health = value;
    }
}