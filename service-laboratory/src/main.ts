import { NestFactory } from '@nestjs/core';
import { LaboratoryModule } from './laboratory.module';

async function bootstrap() {
  const app = await NestFactory.create(LaboratoryModule);
  await app.listen(3006);
}
bootstrap();
