import { UUID, randomUUID } from "crypto";

export class  Logs{

    public  id : UUID;
    public type : string;
    public message : string;
    public timestamp : Date;
    public rocketname : string;

    constructor( type : string, message : string, rocketname : string){
        this.id = randomUUID();
        this.type = type;
        this.message = message;
        this.timestamp = new Date();
        this.rocketname = rocketname;
    }

    getId(){
        return this.id;
    }

    public getType(){
        return this.type;
    }

    public getMessage(){
        return this.message;
    }

    getTimestamp(){
        return this.timestamp;
    }

    getRocketname(){
        return this.rocketname;
    }

    setRocketname(rocketname : string){
        this.rocketname = rocketname;
    }
    
}