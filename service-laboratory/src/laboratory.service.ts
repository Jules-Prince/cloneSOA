import {Injectable} from '@nestjs/common';
import {ILogObj, Logger} from 'tslog';
import * as process from "process";
import {Measure} from "./dto/measure.dto";

const axios = require('axios');

@Injectable()
export class LaboratoryService {
    private readonly log: Logger<ILogObj> = new Logger();
    private readonly logPrefix = "[Laboratory]";
    private isRunningExperiment = false;


    async mesure() {
        const url = process.env.PAYLOAD_URL + "/measure";
        const response = await axios.get(url);
        const measure = new Measure();
        const responseData = response.data;
        measure.gray = responseData.gray;
        console.log(`${this.logPrefix} Recieved a mesurement : ` + measure.gray);
        this.analyzeMeasure(measure);
    }

    private analyzeMeasure(measure: Measure) {
        if (measure.gray < 8) {
            console.log(`${this.logPrefix} Après analyse il s'agit d'une éruption de classe A. Rien à craindre sur Terre`);
        } else if (measure.gray < 12) {
            console.log(`${this.logPrefix} Après analyse il s'agit d'une éruption de classe B. Puissant mais rien à craindre sur Terre`);
        } else if (measure.gray < 30) {
            console.log(`${this.logPrefix} Après analyse il s'agit d'une éruption de classe C. Des perturbations sont à prévoir sur les appareils GPS et communication radio`);
        } else if (measure.gray < 100) {
            console.log(`${this.logPrefix} Après analyse il s'agit d'une éruption de classe M. Cette éruption est capable de perturber les signaux électriques sur Terre`);
        } else {
            console.log(`${this.logPrefix} Après analyse il s'agit d'une éruption de classe X. La quantité d'énergie est énorme. Des grosses perturbations sont attendues, y compris venant des satellites.`);
        }
    }

    startExperiment() {
        this.log.info(`${this.logPrefix} I'm starting the mesurement`);
        this.isRunningExperiment = true;

        const fetcher = async () => {
            if (this.isRunningExperiment == false) {
                return;
            }

            this.mesure();


            if (this.isRunningExperiment == true) {
                setTimeout(() => {
                    fetcher();
                }, 3000);
            }
        }

        fetcher();

    }

    stopExperiment() {
        this.isRunningExperiment = false;
        this.log.info(`${this.logPrefix} I'm stopping the mesurements`);
    }


}
