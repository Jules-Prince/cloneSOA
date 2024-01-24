import { NestFactory } from '@nestjs/core';
import { PayloadModule } from './payload.module';

async function bootstrap() {
  const app = await NestFactory.create(PayloadModule);
  await app.listen(3007);
}
bootstrap();
