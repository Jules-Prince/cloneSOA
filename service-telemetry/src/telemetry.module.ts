/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import {ConfigModule} from "@nestjs/config";
import {MetricsModule} from "./metrics.module";
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      dbName: 'rocketmetrics',
    }),
    MetricsModule,
    KafkaModule.forRoot({ clientId: 'service-telemetry', groupId: 'telemetry' })
  ],

})
export class TelemetryModule {}
