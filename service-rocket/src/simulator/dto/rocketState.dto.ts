export class RocketStateDTO {
    rocketStatus: RocketStages[];
    speed: number;
    height: number;
    life: number;
    state: string;
    incline: number;
    atmosphericPressure: number;
    densityPressure: number;
    temperature: number;
    rocketName: string;

    constructor(rocketStatus: RocketStages[],
                speed: number,
                height: number,
                incline: number,
                life: number,
                state: string,
                atmosphericPressure: number,
                densityPressure:number,
                temperature: number,
                rocketName: string) {

        this.rocketStatus = rocketStatus;
        this.speed = speed;
        this.height = height;
        this.life = life;
        this.state = state;
        this.incline = incline;
        this.atmosphericPressure = atmosphericPressure;
        this.densityPressure = densityPressure;
        this.temperature = temperature;
        this.rocketName = rocketName;
    }

}

export class RocketStages {
    stage: number;
    currentFuel: number;

    constructor(stage: number, currentFuel: number){
        this.currentFuel = currentFuel;
        this.stage = stage;
    }
}
