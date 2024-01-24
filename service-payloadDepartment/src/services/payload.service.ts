import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {PayloadPosition, PayloadPositionDocument} from "../models/payload";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class PayloadService {
    constructor(
        @InjectModel(PayloadPosition.name) private payloadRepository: Model<PayloadPositionDocument>,
    ) {}

    save(payload: PayloadPosition) {
        return this.payloadRepository.create(payload);
    }

    async getAllPayloadPositions(): Promise<PayloadPosition[]> {
        try {
          const payloadPositions = await this.payloadRepository.find().exec();
          return payloadPositions;
        } catch (error) {
          throw error;
        }
      }
}
