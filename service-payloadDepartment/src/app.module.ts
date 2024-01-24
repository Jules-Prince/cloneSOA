import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import {ConfigModule} from "@nestjs/config";
import {PayloadService} from "./services/payload.service";
import {PayloadPosition, PayloadPositionSchema} from "./models/payload";
import {KafkaModule} from "./kafka/kafka.module";

@Module({
  imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRoot(process.env.DATABASE_URL, {
          dbName: 'payload_metrics',
      }),
      MongooseModule.forFeature([{ name: PayloadPosition.name, schema: PayloadPositionSchema }]),
      KafkaModule.forRoot({ clientId: 'service-payload-department', groupId: 'payload-department' })
  ],
  controllers: [AppController],
  providers: [AppService, PayloadService],
})
export class AppModule {}
