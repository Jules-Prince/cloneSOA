import {ApiProperty} from "@nestjs/swagger";

export class MissionDto {
    @ApiProperty({
        enum: ['go', 'no go']
    })
    status: string;

    constructor(partial: Partial<MissionDto>) {
        Object.assign(this, partial);
    }
}
