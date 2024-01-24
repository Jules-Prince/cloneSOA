import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type PayloadPositionDocument = PayloadPosition & Document;

@Schema({
    versionKey: false,
})
export class PayloadPosition {
    @Prop({ required: true })
    x: number;
    @Prop({ required: true })
    y: number;
}


export const PayloadPositionSchema = SchemaFactory.createForClass(PayloadPosition);
