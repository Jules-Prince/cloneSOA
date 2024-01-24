/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import {ConfigModule} from "@nestjs/config";
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [HttpModule, ConfigModule.forRoot(),KafkaModule.forRoot({ clientId: 'service-webcaster', groupId: 'webcaster' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
