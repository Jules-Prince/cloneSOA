/* eslint-disable prettier/prettier */
import {Controller, Get, Post, Body, OnModuleInit} from '@nestjs/common';
import { AppService } from './app.service';
import {EventStageDto} from "./dto/event.stage.dto";
import { ILogObj, Logger } from 'tslog';
import { KafkaService } from './kafka/kafka.service';

@Controller()
export class AppController implements OnModuleInit{
  private readonly log: Logger<ILogObj> = new Logger();
  private readonly logPrefix = "[Web Caster]";

  constructor(private readonly appService: AppService , private readonly kafkaService : KafkaService) {}

  onModuleInit() {
    this.kafkaService.subscribeToTopics(["monitoring" , "launch"], (topic, message) => {
        /**
         * Bad statement, will not work with multiple service (horizontal scaling)
         * todo: fix this,
         * In this implementation, we suppose that the mission commander service ask the rocket status only
         * when the weather status is good
         */
        switch (topic) {
          case "launch" || "monitoring": {
            const isRocketEvent =  message.key.toString().startsWith("rocketEvent")
            const isStageEvent =  message.key.toString().startsWith("stageEvent")
            if(isRocketEvent){
              const currentTime = new Date().toLocaleTimeString(); // Get current time
              this.log.info(`${this.logPrefix}  [${currentTime}]`);
              console.log(`${this.logPrefix}  rocket event received : ` + message.key.toString())
            }
            else if(isStageEvent){
              const currentTime2 = new Date().toLocaleTimeString(); // Get current time
              this.log.info(`${this.logPrefix}  [${currentTime2}]`);
              console.log(`${this.logPrefix}  stage event received : ` + message.key.toString())
            }
            else{
              switch (message.key?.toString()) {  
              }
              break;
            }
        }

        }
            

    });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/event/stage")
  async eventStage(@Body() eventStageDto: EventStageDto): Promise<string> {
    this.log.info(`${this.logPrefix} Evenement stage : ` + eventStageDto.description);
    return `Événement reçu avec succès : ID ${eventStageDto.id}, Description "${eventStageDto.description}", Date ${eventStageDto.date}`;
  }

  @Post("/event/rocket")
  async eventRocket(@Body() eventStageDto: EventStageDto): Promise<string> {
    this.log.info(`${this.logPrefix} Evenement rocket : ` + eventStageDto.description);
    return `Événement reçu avec succès : ID ${eventStageDto.id}, Description "${eventStageDto.description}", Date ${eventStageDto.date}`;
  }
}
