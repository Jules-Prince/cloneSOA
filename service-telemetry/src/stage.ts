export class Stage{
    height:number;
    name:string;
    parachute:boolean;
    state:string;

    constructor(height: number, name: string, parachute: boolean, state:string) {
        this.height = height;
        this.name = name;
        this.parachute = parachute;
        this.state = state;
    }
}