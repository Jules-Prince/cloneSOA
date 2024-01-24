import { Module } from '@nestjs/common';
import { RocketController } from './controllers/rocket.controller';
import { RocketService } from './rocket.service';
import {HttpModule} from "@nestjs/axios";
import {RocketTelemetryController} from "./controllers/rocket-telemetry.controller";
import {RocketPayloadController} from "./controllers/rocket-payload.controller";
import {ConfigModule} from "@nestjs/config";
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [HttpModule, ConfigModule.forRoot(),KafkaModule.forRoot({ clientId: 'service-rocket', groupId: 'rocket' })],
  controllers: [RocketController , RocketTelemetryController,
  RocketPayloadController],
  providers: [RocketService],
})
export class RocketModule {}
