import { HttpModule } from "@nestjs/axios";
import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Metrics, MetricsSchema} from "./schemas/metrics.schema";
import {TelemetryController} from "./telemetry.controller";
import {TelemetryService} from "./telemetry.service";
import {MetricsStage, MetricsStageSchema} from "./schemas/metrics.stage.schema";

@Module({
    imports: [HttpModule,
    MongooseModule.forFeature([{ name: Metrics.name, schema: MetricsSchema }]),
        MongooseModule.forFeature([{ name: MetricsStage.name, schema: MetricsStageSchema }])
    ],
    controllers: [TelemetryController],
    providers: [TelemetryService],
})
export class MetricsModule {}