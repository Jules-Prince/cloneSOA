import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {ApiProperty} from "@nestjs/swagger";

import { Document } from 'mongoose';
export type MetricsStageDocument = MetricsStage & Document;

@Schema({
    versionKey: false,
})

export class MetricsStage {




    @ApiProperty()
    @Prop({ required: true })
    name:string;

    @ApiProperty()
    @Prop({ required: true })
    height: number;

    @ApiProperty()
    @Prop({ required: true })
    parachute: boolean;


    @ApiProperty()
    @Prop({ required: true })
    state: string;

    constructor(name: string, height: number, parachute: boolean, state:string) {
        this.name = name;
        this.height = height;
        this.parachute = parachute;
        this.state = state;
    }
}

export const MetricsStageSchema = SchemaFactory.createForClass(MetricsStage);
