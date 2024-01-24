import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {ApiProperty} from "@nestjs/swagger";

import { Document } from 'mongoose';
export type MetricsDocument = Metrics & Document;

@Schema({
    versionKey: false,
})

export class Metrics {

    @ApiProperty()
    @Prop({ required: true })
    rocketStatus: {
        currentFuel: number;
        stage: number;
    }[];

    @ApiProperty()
    @Prop({ required: true })
    speed: number;

    @ApiProperty()
    @Prop({ required: true })
    height: number;

    @ApiProperty()
    @Prop({ required: true })
    life: number;

    @ApiProperty()
    @Prop({ required: true })
    state: string;

    @ApiProperty()
    @Prop({ required: true })
    incline: number;

    @ApiProperty()
    @Prop({ required: true })
    atmosphericPressure: number;

    @ApiProperty()
    @Prop({ required: true })
    densityPressure: number;

    @ApiProperty()
    @Prop({ required: true })
    temperature: number;

    @ApiProperty()
    @Prop({ required: false })
    rocketName: string;

    constructor(height: number, speed: number, incline:number,
                life: number, state: string, rocketStatus: { currentFuel: number; stage: number; }[],
                atmosphericPressure: number, densityPressure: number, temperature: number,
                rocketName: string) {

        this.speed = speed;
        this.height = height;
        this.life = life;
        this.state = state;
        this.rocketStatus = rocketStatus;
        this.incline = incline;
        this.atmosphericPressure = atmosphericPressure;
        this.densityPressure = densityPressure;
        this.temperature = temperature;
        this.rocketName = rocketName;
    }


}

export const MetricsSchema = SchemaFactory.createForClass(Metrics);
