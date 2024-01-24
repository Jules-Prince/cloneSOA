import {Body, Controller, Get, Post} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { ILogObj, Logger } from 'tslog';
import { CassandraService } from '../services/logs.service';
import { ApiResponse } from '@nestjs/swagger';
import Row = types.Row;
import { types } from 'cassandra-driver';
import { Logs } from '../logs.model';


@Controller()
export class MissionCommanderLogsController {

    private readonly log: Logger<ILogObj> = new Logger();
    private readonly logPrefix = "[Mission status]";

    constructor(private logsService : CassandraService) {}


    @Get("/logs")
    @ApiResponse({
        status: 200,
        description: 'get the logs',
        type: String
    })
    getLogs(): Promise<Row[]> {
        return  this.logsService.getData();
    }


    @Post("/Push-log")

    async pushLog(@Body() logs : Logs): Promise<string> {
        await this.logsService.pushLog(logs);
        return "Log pushed";
    }
}
