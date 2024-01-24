import { Controller, Get, Post } from '@nestjs/common';
import { PayloadService } from './payload.service';
import { Logger, ILogObj } from 'tslog';
import { Measure } from './dto/measure.dto';

@Controller()
export class PayloadController {
  private readonly log: Logger<ILogObj> = new Logger();
  private readonly logPrefix = '[Payload]';

  constructor(private readonly satelliteService: PayloadService) {}

  @Post('/start')
  startTelemetry() {
    this.log.info(
      `${this.logPrefix} The payload position simulation start now`,
    );

    PayloadService.startTime = Date.now();
    return { status: 'ok' };
  }

  @Get('/position')
  getPosition() {
    const timeSinceDeploy = (Date.now() - PayloadService.startTime) / 1000;
    this.log.info(`${this.logPrefix} Receive position request`);
    this.log.info(
      `${this.logPrefix} The time since deploy is ${timeSinceDeploy.toFixed(
        2,
      )}s`,
    );
    this.log.info(
      `${
        this.logPrefix
      } The current position of the payload is  ${JSON.stringify(
        this.satelliteService.simulate(timeSinceDeploy),
      )}s`,
    );

    return this.satelliteService.simulate(timeSinceDeploy);
  }

  @Get('/measure')
  measureRadiation(): Measure {
    return this.satelliteService.measureRadiation();
  }
}
