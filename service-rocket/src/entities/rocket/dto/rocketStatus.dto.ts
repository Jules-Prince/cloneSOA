import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class RocketStatusDto {
    @ApiProperty({
        description: 'It either \"go\" or \"no_go\"'
    })
    @IsNotEmpty()
    status : string

    constructor(status: string) {
        this.status = status
    }
}