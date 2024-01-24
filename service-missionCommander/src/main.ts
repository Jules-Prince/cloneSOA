import { NestFactory } from '@nestjs/core';
import { MissionCommanderModule } from './missionCommander.module';
import {ConfigService} from "@nestjs/config";
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(MissionCommanderModule, {cors: true});
  app.get(ConfigService);

  const config = new DocumentBuilder()
      .setTitle("Mission status")
      .setDescription("")
      .build()
  ;
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, doc);
  SwaggerModule.setup('swagger-ui/index.html', app, doc);
  await app.listen(3005);
}
bootstrap();
