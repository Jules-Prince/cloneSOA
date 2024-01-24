import { ApiProperty } from "@nestjs/swagger";

export class WeatherStatusDto{
  @ApiProperty({
    description: 'The status of the weather',
    })
    
    status: string;

    constructor(status: string){
        this.status = status;
    }

}