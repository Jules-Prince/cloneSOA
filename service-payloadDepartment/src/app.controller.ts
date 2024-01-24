import {Body, Controller, Post,Get} from '@nestjs/common';
import { AppService } from './services/app.service';
import { Logger, ILogObj } from "tslog";
import {DataDto} from "./models/data.dto";
import {KafkaService} from "./kafka/kafka.service";

@Controller()
export class AppController {
  private readonly log: Logger<ILogObj> = new Logger();
  private readonly logPrefix = "[Payload Department]";
  constructor(private readonly appService: AppService, private readonly kafkaService: KafkaService) {}

  @Post("/approve")
  approbation(@Body() data: DataDto) {
    this.log.info(`${this.logPrefix} Réception des informations de position`);
    this.log.info(`${this.logPrefix} Données reçues : ` + data.height);
    this.log.info(`${this.logPrefix} Tout est bon. Reponse de lancement du payload dans l'espace`);
    return {
      "command": "go"
    };
  }

  @Post("/start-telemetry")
  startTelemetry() {
    this.log.info(`${this.logPrefix} Réception de la demande d'observation du déplacement du payload`);
    this.log.info(`${this.logPrefix} Observation du déplacement du payload à intervalle régulier de 3s`);
    this.log.info(`${this.logPrefix} Emission d'un message Kafka pour signaler le début de l'observation du déplacement du payload`);
    this.kafkaService.emitMessage("monitoring", "payload-telemetry-started", "{ \"status\": \"ok\" }");

    setTimeout(() => {
      this.stopTelemetry();
    }, 15000);

    this.appService.startTelemetry();


    return {
      "status": "ok"
    };
  }

  @Post("/stop-telemetry")
  stopTelemetry() {
    this.appService.stopTelemetry();

    return {
      "status": "ok"
    };
  }

  @Get("/all-payload-positions")
  getAllPayloadPositions() {
    return this.appService.getAllPayloadPositions();
  }
}
