import {ApiProperty} from "@nestjs/swagger";

export class LaunchStatusDto {
    @ApiProperty({
        description: 'It either \"go\" or \"no_go\"'
    })
    status : string;

    constructor() {
    }


}

export default LaunchStatusDto;