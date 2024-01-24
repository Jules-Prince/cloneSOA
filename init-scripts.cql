-- 01-init.cql
CREATE KEYSPACE IF NOT EXISTS MissionLogs WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
USE MissionLogs;

CREATE TABLE IF NOT EXISTS Logs (
    id UUID PRIMARY KEY,
    timestamp TIMESTAMP,
    message TEXT,
    type TEXT,
    rocketname TEXT
);
