import { UUID, randomUUID } from "crypto";

export class  LogsDTO{

    public type : string;
    public message : string;
    rocketname: string;

    constructor(type : string, message : string , rocketname : string){
        this.type = type;
        this.rocketname = rocketname;
        this.message = message;
    }
}