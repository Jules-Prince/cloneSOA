import { Injectable } from '@nestjs/common';
import * as process from 'process';
import { ILogObj, Logger } from 'tslog';
import { PayloadPosition } from '../models/payload';
import { PayloadService } from './payload.service';
import {KafkaService} from "../kafka/kafka.service";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');

@Injectable()
export class AppService {
  private readonly log: Logger<ILogObj> = new Logger();
  private readonly logPrefix = '[Payload Department]';
  static isRunning = false;

    constructor(private readonly payloadService: PayloadService, private readonly kafkaService: KafkaService) {
    }

  // Work with recursion to await the response
  startTelemetry() {
    AppService.isRunning = true;
    console.log(`${this.logPrefix} env lab : ` + process.env.LABORATORY_URl);
    this.startMesurementInTheLaboratory();

    const fetcher = async () => {
      if (AppService.isRunning == false) {
        return;
      }

      this.log.info(
        ` ${this.logPrefix} Récupération des données de position du payload`,
      );
      const response = await axios.get(process.env.PAYLOAD_URL + '/position');
      const responseData = response.data;

      this.log.info(
        `${this.logPrefix} La position actuelle du payload est ${JSON.stringify(
          responseData,
        )}`,
      );

      const position = new PayloadPosition();
      Object.assign(position, responseData);
      await this.payloadService.save(position);

            this.kafkaService.emitMessage("monitoring", "payload-telemetry-data", JSON.stringify(position));

            if (AppService.isRunning == true) {
                setTimeout(() => {
                    fetcher();
                }, 3000);
            }
        }

    fetcher();
  }

  stopTelemetry() {
    this.log.info(
      `${this.logPrefix} Arrêt de l'observation de la postion du payload`,
    );
    AppService.isRunning = false;
    this.stopMesurementInTheLaboratory();
  }

  private startMesurementInTheLaboratory() {
    axios.get(process.env.LABORATORY_URl + '/start-experiment');
  }

  private stopMesurementInTheLaboratory() {
    axios.get(process.env.LABORATORY_URl + '/stop-experiment');
  }

  async getAllPayloadPositions() {
    return this.payloadService.getAllPayloadPositions();
  }

  
}
