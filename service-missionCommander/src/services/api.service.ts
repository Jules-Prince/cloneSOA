import {Injectable} from "@nestjs/common";
import * as process from "process";
import {ILogObj, Logger} from "tslog";

const axios = require('axios');

@Injectable()
export class ApiService {
    private readonly log: Logger<ILogObj> = new Logger();

    async getWeatherStatus(): Promise<string> {
        try {
            const response = await axios.get(`${process.env.WEATHER_URL}/weather-status`).then((res) => {
                return res.data
            });
            return response.status;
        } catch (e) {
            this.log.error("Weather status fail with error : " + e);
            return "no go";
        }
    }

    async getRocketStatus(): Promise<string> {
        try {
            const rocketNames: string[] = [
                'Nebula Voyager',
                'Stellar Phoenix',
                'Galactic Explorer',
                'Celestial Serenity',
                'Infinity Blaze',
                'Orion Odyssey',
                'Cosmic Velocity',
                'Solar Stormer',
                'Astro Nebula',
                'Luna Horizon',
                'Nova Ascendant',
                'Quasar Quest',
                'Pegasus Express',
                'Interstellar Titan',
                'Comet Crusader',
                'Aurora Eclipse',
                'Zenith Zephyr',
                'Velocity Vanguard',
            ];

            const randomIndex = Math.floor(Math.random() * rocketNames.length);
            this.log.info(`[Mission status] Start launch check for the rocket **${rocketNames[randomIndex]}**`)
            const params = {'name': rocketNames[randomIndex]}
            const response = await axios.get(`${process.env.ROCKET_URL}/launch-request`, {params}).then((res) => {
                return res.data
            });

            return response.status;
        } catch (e) {
            this.log.error("Rocket status fail with error : " + e);
            return "no go";
        }
    }

    async launchRocket(failure = false,auto): Promise<string> {
        try {
            const params = {'failure': failure,'auto':auto}
            const response = await axios.get(`${process.env.ROCKET_URL}/launch-order`, {params}).then((res) => {
                return res.data
            });
            return response.status;
        } catch (e) {
            this.log.error("Rocket launch fail with error : " + e);
            return "no go";
        }

    }
}
