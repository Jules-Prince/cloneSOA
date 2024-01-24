export class Weather{

    private status : string;

    constructor(){
        this.status = "good";
    }

    public getStatus(): string{
        return this.status;
    }

}