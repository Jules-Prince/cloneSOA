import { NestFactory } from '@nestjs/core';
import { RocketModule } from './rocket.module';
import {ConfigService} from "@nestjs/config";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

const PORT = process.env.PORT_ROCKETSTATUS

async function bootstrap() {

  const app = await NestFactory.create(RocketModule);
  app.get(ConfigService); // add environment variables

  const config = new DocumentBuilder()
      .setTitle('Rocket Status')
      .setDescription('The rocket status API description')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);


}
bootstrap();
