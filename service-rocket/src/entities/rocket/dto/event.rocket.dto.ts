export class EventRocketDto{
    id:number;
    description:string;
    date:number;

    constructor(id: number, description: string, date: number) {
        this.id = id;
        this.description = description;
        this.date = date;
    }
}