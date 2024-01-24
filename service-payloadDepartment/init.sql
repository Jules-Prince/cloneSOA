-- Création de la base de données
CREATE DATABASE IF NOT EXISTS payload_metrics;

-- Utilisation de la base de données
USE payload_metrics;

-- Création de la table position
CREATE TABLE IF NOT EXISTS positions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    x DECIMAL(10, 2) NOT NULL,
    y DECIMAL(10, 2) NOT NULL
);
