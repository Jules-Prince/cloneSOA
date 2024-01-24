/* eslint-disable prettier/prettier */
import { Injectable, Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {Kafka, Producer, Consumer, KafkaMessage} from 'kafkajs';
import * as process from "process";

/**
 * The kafka service to send or receive message.
 *
 * @author damedomey
 */
@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private producer: Producer;
    private consumers: Map<string, Consumer> = new Map();

    constructor(@Inject('KAFKA_OPTIONS') private readonly options: { clientId: string, groupId: string }) {}

    async onModuleInit() {
        this.kafka = new Kafka({
            clientId: this.options.clientId,
            brokers: ['kafka:9092'],
        });

        this.producer = this.kafka.producer();
        await this.producer.connect();
    }

    async onModuleDestroy() {
        await this.producer.disconnect();

        // Disconnect all consumers
        for (const consumer of this.consumers.values()) {
            await consumer.disconnect();
        }
    }

    async emitMessage(topic: string, key: string, message: any): Promise<void> {
        await this.producer.send({
            topic,
            messages: [{ key, value: message }],
        });
    }

    async subscribeToTopics(topics: string[], callback: (topic: string, message: KafkaMessage) => void): Promise<void> {
        const consumer = this.kafka.consumer({ groupId: this.options.groupId });
        await consumer.connect();
        await consumer.subscribe({ topics, fromBeginning: false });
        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                callback(topic, message);
            },
        });
    }
}