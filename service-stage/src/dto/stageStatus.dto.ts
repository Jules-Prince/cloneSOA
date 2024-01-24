import * as string_decoder from "string_decoder";

export class StageStatusDto{
    name:string = ""
    height:number = 0
    parachute:boolean = false;
    state:string;

    constructor(name: string, height: number, parachute: boolean, state:string) {
        this.name = name;
        this.height = height;
        this.parachute = parachute;
        this.state = state;
    }
}