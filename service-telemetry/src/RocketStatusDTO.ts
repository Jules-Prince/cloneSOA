export class RocketStatusDTO {

    rocketStatus: {
        currentFuel: number;
        stage: number;
    }[];

    speed: number;
    height: number;
    life: number;
    state: string;
    incline: number;
    atmosphericPressure: number;
    densityPressure: number;
    temperature: number;
    rocketName: string;
}
