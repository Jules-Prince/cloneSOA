import {ApiProperty} from "@nestjs/swagger";

export class StageDto {
    @ApiProperty()
    height:number;


    constructor(height: number) {
        this.height = height;
    }
}