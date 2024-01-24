import {Module} from '@nestjs/common';
import {MissionCommanderController} from './controllers/missionCommander.controller';
import {ApiService} from "./services/api.service";
import {MissionService} from './services/mission.service';
import {ConfigModule} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";
import {CassandraService} from "./services/logs.service";
import { MissionCommanderLogsController } from './controllers/logs.controller';
import { KafkaModule } from './kafka/kafka.module';

@Module({
    imports: [HttpModule, ConfigModule.forRoot(),KafkaModule.forRoot({ clientId: 'service-mission-commander', groupId: 'mission-commander' })],
    controllers: [MissionCommanderController,MissionCommanderLogsController],
    providers: [ApiService, MissionService,CassandraService],
})
export class MissionCommanderModule {
}
