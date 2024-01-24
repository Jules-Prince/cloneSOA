/* eslint-disable prettier/prettier */
import { Module, Global } from '@nestjs/common';
import { KafkaService } from './kafka.service';

/**
 * Kafka module to  made kafka integration more easier
 * @author damedomey
 */
@Global()
@Module({
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {
  static forRoot(options: { clientId: string, groupId: string }) {
    return {
      module: KafkaModule,
      providers: [
        {
          provide: 'KAFKA_OPTIONS',
          useValue: options,
        },
      ],
    };
  }
}

export { KafkaService };
