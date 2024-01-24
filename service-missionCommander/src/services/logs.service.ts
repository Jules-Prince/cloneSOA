import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, mapping, auth } from 'cassandra-driver';
import { Logs } from '../logs.model';
import { LogsDTO } from 'src/dto/logs.dto';
import {ILogObj, Logger} from "tslog";
const util = require('util');



@Injectable()
export class CassandraService  implements OnModuleInit{



    private readonly log: Logger<ILogObj> = new Logger();
    private readonly logPrefix = "[Mission status]";
    
    private readonly cassandraClient: Client;

    constructor() {
        this.cassandraClient = new Client({
            contactPoints: ['cassandra:9042'], // Use the hostname defined in Docker Compose
            localDataCenter: 'datacenter1', // Set your data center name
        });
    }

    async onModuleInit() {
        await this.connect();
        await this.createKeyspaceAndTableMetrics();
    }
    async executeQuery(query: string, params?: any[]) {
        try {
            const result = await this.cassandraClient.execute(query, params);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async pushLog(newlog : LogsDTO){
        const query = 'INSERT INTO MissionLogs.logs (id, type, message, timestamp,rocketname) VALUES (?,?,?,?,?);';
        const log = new Logs(newlog.type,newlog.message,newlog.rocketname);
        const values = [log.getId(),log.getType(),log.getMessage(),log.getTimestamp(),log.getRocketname()];

        try {
            const result = await this.executeQuery(query, values);
            return result.rows;
        } catch (error) {
            throw error;
        }
        
    }

    async getData() {
        const query = 'SELECT * FROM MissionLogs.logs;';
        try {
            const result = await this.executeQuery(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async createKeyspaceAndTableMetrics() {
        const createKeyspaceQuery = "CREATE KEYSPACE IF NOT EXISTS MissionLogs WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};"
        const usedb = "USE MissionLogs;"
        const createTableQuery = "CREATE TABLE IF NOT EXISTS Logs (id UUID PRIMARY KEY,timestamp TIMESTAMP,message TEXT,type TEXT,rocketname TEXT);"
      
        await this.cassandraClient.execute(createKeyspaceQuery);
        await this.cassandraClient.execute(usedb);
        await this.cassandraClient.execute(createTableQuery);
    }

    async createKeyspaceAndTableEvents() {
        const usedb = "USE MissionLogs;"
        const createTableQuery = "CREATE TABLE IF NOT EXISTS EventLogs (id UUID PRIMARY KEY,timestamp TIMESTAMP,message TEXT,type TEXT,rocketname TEXT);"
      
        await this.cassandraClient.execute(usedb);
        await this.cassandraClient.execute(createTableQuery);
    }

    async checkFinished() {
        const query = 'SELECT * FROM MissionLogs.logs;';
        try {
            const result = await this.executeQuery(query);
            const logs = result.rows;
            for (const log of logs) {
                if(log.type.startsWith("rocketEvent") && log.message.startsWith("finished")){
                    return "true";
            }
            return "false";
       
        } 
    } catch (error) {
        throw error;
    }
    }

    async deleteAll(){
        const query = 'TRUNCATE MissionLogs.logs;';
        try {
            const result = await this.executeQuery(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }


    

    async seeMissionLogs() {
        const query = 'SELECT * FROM MissionLogs.logs;';
        try {
            const result = await this.executeQuery(query);
            const logs = result.rows;
            const stageEvents = [];
            const rocketEvents = [];

            for (const log of logs) {
                
                const { id, ...logWithoutId } = log;

                if (logWithoutId.type.startsWith("stageEvent")) {
                    stageEvents.push(logWithoutId);
                }
                if (logWithoutId.type.startsWith("rocketEvent")) {
                    rocketEvents.push(logWithoutId);
                }


            }

            return { stageEvents, rocketEvents };
            
        } catch (error) {
            throw error;
        }
    }

    async closeConnection() {
        await this.cassandraClient.shutdown();
    }

    async connect() {
        await this.cassandraClient.connect();
    }



}
