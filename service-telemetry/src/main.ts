import {NestFactory} from '@nestjs/core';
import {TelemetryModule} from './telemetry.module';

async function bootstrap() {
    const app = await NestFactory.create(TelemetryModule);
    await app.listen(3004);
}

bootstrap();
